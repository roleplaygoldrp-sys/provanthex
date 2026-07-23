import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { openai } from '@/lib/openai'
import prisma from '@/lib/db'
import { z } from 'zod'

const chatSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1, 'Mensagem não pode estar vazia'),
  specialistId: z.string().optional(),
  detailLevel: z.enum(['BASIC', 'DETAILED']).optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { conversationId, message, specialistId, detailLevel } = chatSchema.parse(body)

    // Get user and check credits/plan
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const isPro = user.plan === 'PRO' && user.subscriptionStatus === 'ACTIVE'

    // Check credits for free users
    if (!isPro && user.credits <= 0) {
      return NextResponse.json(
        { error: 'Créditos esgotados. Faça upgrade para o plano Pro.' },
        { status: 403 }
      )
    }

    // Get or create conversation
    let conversation
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 20, // Last 20 messages for context
          },
          specialist: true,
        },
      })

      if (!conversation || conversation.userId !== session.user.id) {
        return NextResponse.json(
          { error: 'Conversa não encontrada' },
          { status: 404 }
        )
      }
    } else {
      // Create new conversation
      const specialist = specialistId 
        ? await prisma.specialist.findUnique({ where: { id: specialistId } })
        : await prisma.specialist.findFirst({ where: { slug: 'consultor-geral' } })

      conversation = await prisma.conversation.create({
        data: {
          userId: session.user.id,
          specialistId: specialist?.id,
          detailLevel: isPro ? (detailLevel || 'BASIC') : 'BASIC',
          title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
        },
        include: {
          messages: true,
          specialist: true,
        },
      })
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'USER',
        content: message,
      },
    })

    // Build conversation history for context
    const conversationHistory = conversation.messages
      .map((msg) => `${msg.role === 'USER' ? 'Usuário' : 'Assistente'}: ${msg.content}`)
      .join('\n\n')

    // Build the prompt based on specialist
    const specialist = conversation.specialist
    let systemPrompt = specialist?.prompt || `Você é o Consultor Geral de Marketing Digital da Vanthex IA.`
    
    // Replace placeholders in prompt
    systemPrompt = systemPrompt
      .replace('{conversation_history}', conversationHistory)
      .replace('{user_message}', message)

    // Add detail level instruction
    const levelInstruction = conversation.detailLevel === 'DETAILED' 
      ? 'Forneça uma resposta detalhada e exhaustiva, incluindo exemplos, dados e análises profundas.'
      : 'Forneça uma resposta clara e objetiva, focando no essencial.'

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'system', content: levelInstruction },
        ...conversation.messages.slice(-10).map((msg) => ({
          role: msg.role === 'USER' ? 'user' : 'assistant',
          content: msg.content,
        })),
        { role: 'user', content: message },
      ],
      max_tokens: conversation.detailLevel === 'DETAILED' ? 4000 : 2000,
      temperature: 0.7,
    })

    const assistantMessage = response.choices[0]?.message?.content || 'Desculpe, não consegui processar sua solicitação.'

    // Save assistant message
    const assistantMessageDb = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'ASSISTANT',
        content: assistantMessage,
        tokens: response.usage?.total_tokens,
      },
    })

    // Deduct credit for free users
    if (!isPro) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          credits: {
            decrement: 1,
          },
        },
      })
    }

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({
      message: assistantMessageDb,
      conversation: {
        id: conversation.id,
        credits: isPro ? null : user.credits - 1,
      },
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Erro ao processar mensagem' },
      { status: 500 }
    )
  }
}
