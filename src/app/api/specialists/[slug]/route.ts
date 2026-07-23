import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const specialist = await prisma.specialist.findUnique({
      where: { slug: params.slug },
    })

    if (!specialist) {
      return NextResponse.json(
        { error: 'Especialista não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ specialist })
  } catch (error) {
    console.error('Get specialist error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar especialista' },
      { status: 500 }
    )
  }
}
