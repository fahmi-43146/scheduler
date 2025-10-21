/*import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updated = await prisma.user.update({
      where: { id: params.id },
      data: { approved: true }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error approving user:', error)
    return NextResponse.json({ error: 'Failed to approve user' }, { status: 500 })
  }
}*/


