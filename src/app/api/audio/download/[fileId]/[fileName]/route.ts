import { NextRequest, NextResponse } from 'next/server';
import { readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string, fileName: string } }
) {
  try {
    const { fileId, fileName } = params;
    
    if (!fileId || !fileName) {
      return NextResponse.json(
        { error: '缺少文件ID或文件名' },
        { status: 400 }
      );
    }
    
    const filePath = join(process.cwd(), 'public', 'uploads', fileId, fileName);
    
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: '文件不存在' },
        { status: 404 }
      );
    }
    
    // 在實際應用中，這裡應該返回文件流
    // 由於我們使用的是模擬處理，這裡只返回文件下載URL
    
    return NextResponse.json({
      success: true,
      downloadUrl: `/uploads/${fileId}/${fileName}`
    });
    
  } catch (error) {
    console.error('獲取下載URL錯誤:', error);
    return NextResponse.json(
      { error: '獲取下載URL失敗' },
      { status: 500 }
    );
  }
}
