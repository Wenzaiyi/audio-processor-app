import { NextRequest, NextResponse } from 'next/server';
import { getProcessingStatus } from '@/lib/audio/processing-queue';

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params;
    
    if (!fileId) {
      return NextResponse.json(
        { error: '缺少文件ID' },
        { status: 400 }
      );
    }
    
    const status = await getProcessingStatus(fileId);
    
    if (!status) {
      return NextResponse.json(
        { error: '未找到文件信息' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(status);
    
  } catch (error) {
    console.error('獲取處理狀態錯誤:', error);
    return NextResponse.json(
      { error: '獲取處理狀態失敗' },
      { status: 500 }
    );
  }
}
