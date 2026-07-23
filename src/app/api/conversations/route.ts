import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const conversations = await prisma.conversation.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        specialist: true,
        _count: {
          select: { messages: true },
        },
      },
    })

    const total = await prisma.conversation.count({
      where: { userId: session.user.id },
    })

    return NextResponse.json({
      conversations,
      total,
    })
  } catch (error) {
    console.error('Get conversations error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar conversas' },
      { status: 500 }
    )
  }
}
