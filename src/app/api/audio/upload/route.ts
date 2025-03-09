import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'path';

// 確保上傳目錄存在
const ensureUploadDir = async () => {
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }
  return uploadDir;
};

export async function POST(request: NextRequest) {
  try {
    // 生成唯一文件ID
    const fileId = uuidv4();
    
    // 確保上傳目錄存在
    const uploadDir = await ensureUploadDir();
    
    // 創建文件專屬目錄
    const fileDir = join(uploadDir, fileId);
    await mkdir(fileDir, { recursive: true });
    
    // 獲取表單數據
    const formData = await request.formData();
    const audioFile = formData.get('audioFile') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: '未找到音頻文件' },
        { status: 400 }
      );
    }
    
    // 檢查文件類型
    const acceptedTypes = [
      'audio/mpeg', 'audio/mp3',
      'audio/wav', 'audio/x-wav',
      'audio/x-m4a', 'audio/m4a',
      'audio/aac',
      'audio/ogg',
      'audio/flac',
      'audio/x-ms-wma'
    ];
    
    if (!acceptedTypes.includes(audioFile.type)) {
      return NextResponse.json(
        { error: '不支持的文件格式' },
        { status: 400 }
      );
    }
    
    // 檢查文件大小 (50MB = 52428800 bytes)
    if (audioFile.size > 52428800) {
      return NextResponse.json(
        { error: '文件大小超過限制' },
        { status: 400 }
      );
    }
    
    // 獲取文件擴展名
    const originalName = audioFile.name;
    const { ext } = parse(originalName);
    
    // 保存原始文件
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const originalFilePath = join(fileDir, `original${ext}`);
    await writeFile(originalFilePath, buffer);
    
    // 創建文件信息記錄
    const fileInfo = {
      id: fileId,
      originalName,
      originalPath: `/uploads/${fileId}/original${ext}`,
      size: audioFile.size,
      type: audioFile.type,
      uploadedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天後過期
      status: 'uploaded',
      processingStatus: {
        humanVoiceSeparation: 'pending',
        speakerDiarization: 'pending',
        noiseReduction: 'pending'
      }
    };
    
    // 保存文件信息
    await writeFile(
      join(fileDir, 'info.json'),
      JSON.stringify(fileInfo, null, 2)
    );
    
    return NextResponse.json({
      success: true,
      fileId,
      message: '文件上傳成功'
    });
    
  } catch (error) {
    console.error('文件上傳錯誤:', error);
    return NextResponse.json(
      { error: '文件上傳失敗' },
      { status: 500 }
    );
  }
}
