import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const article = await db.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const deletedArticle = await db.article.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Article deleted successfully', deletedArticle },
      { status: 200 }
    );
  } catch (error: any) {
    // Prisma の delete は存在しないIDの場合エラーを投げるので、その場合のハンドリング
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
