import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const specialists = await prisma.specialist.findMany({
      where: { isActive: true },
      orderBy: { category: 'asc' },
    })

    return NextResponse.json({ specialists })
  } catch (error) {
    console.error('Get specialists error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar especialistas' },
      { status: 500 }
    )
  }
}
