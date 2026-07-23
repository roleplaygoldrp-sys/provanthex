import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id },
      include: {
        specialist: true,
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!conversation || conversation.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error('Get conversation error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar conversa' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id },
    })

    if (!conversation || conversation.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    await prisma.conversation.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete conversation error:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir conversa' },
      { status: 500 }
    )
  }
}
