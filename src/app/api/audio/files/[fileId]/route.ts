import { NextRequest, NextResponse } from 'next/server';
import { getFileInfo } from '@/lib/audio/processing-queue';
import { readdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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
    
    const fileInfo = await getFileInfo(fileId);
    
    if (!fileInfo) {
      return NextResponse.json(
        { error: '未找到文件信息' },
        { status: 404 }
      );
    }
    
    // 獲取文件目錄中的所有文件
    const fileDir = join(process.cwd(), 'public', 'uploads', fileId);
    
    if (!existsSync(fileDir)) {
      return NextResponse.json(
        { error: '文件目錄不存在' },
        { status: 404 }
      );
    }
    
    const files = await readdir(fileDir);
    
    // 過濾出音頻文件
    const audioFiles = files.filter(file => 
      file !== 'info.json' && 
      (file.endsWith('.mp3') || 
       file.endsWith('.wav') || 
       file.endsWith('.m4a') || 
       file.endsWith('.aac') || 
       file.endsWith('.ogg') || 
       file.endsWith('.flac') || 
       file.endsWith('.wma'))
    );
    
    // 構建文件下載URL
    const fileUrls = audioFiles.map(file => ({
      name: file,
      url: `/uploads/${fileId}/${file}`
    }));
    
    return NextResponse.json({
      fileInfo,
      files: fileUrls
    });
    
  } catch (error) {
    console.error('獲取文件信息錯誤:', error);
    return NextResponse.json(
      { error: '獲取文件信息失敗' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    
    const fileDir = join(process.cwd(), 'public', 'uploads', fileId);
    
    if (!existsSync(fileDir)) {
      return NextResponse.json(
        { error: '文件目錄不存在' },
        { status: 404 }
      );
    }
    
    // 獲取目錄中的所有文件
    const files = await readdir(fileDir);
    
    // 刪除所有文件
    for (const file of files) {
      await unlink(join(fileDir, file));
    }
    
    // 刪除目錄（在實際應用中可能需要使用額外的庫來刪除非空目錄）
    // 這裡簡化處理，只刪除文件
    
    return NextResponse.json({
      success: true,
      message: '文件已刪除'
    });
    
  } catch (error) {
    console.error('刪除文件錯誤:', error);
    return NextResponse.json(
      { error: '刪除文件失敗' },
      { status: 500 }
    );
  }
}
