// 音頻處理隊列管理
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// 處理狀態類型
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

// 處理任務類型
export interface ProcessingTask {
  fileId: string;
  taskType: 'humanVoiceSeparation' | 'speakerDiarization' | 'noiseReduction';
  status: ProcessingStatus;
  progress: number;
  startTime?: string;
  endTime?: string;
  error?: string;
}

// 獲取文件信息
export async function getFileInfo(fileId: string) {
  try {
    const fileDir = join(process.cwd(), 'public', 'uploads', fileId);
    const infoPath = join(fileDir, 'info.json');
    
    if (!existsSync(infoPath)) {
      return null;
    }
    
    const infoData = await readFile(infoPath, 'utf-8');
    return JSON.parse(infoData);
  } catch (error) {
    console.error('獲取文件信息錯誤:', error);
    return null;
  }
}

// 更新文件信息
export async function updateFileInfo(fileId: string, updates: any) {
  try {
    const fileInfo = await getFileInfo(fileId);
    
    if (!fileInfo) {
      return false;
    }
    
    const updatedInfo = { ...fileInfo, ...updates };
    
    const fileDir = join(process.cwd(), 'public', 'uploads', fileId);
    const infoPath = join(fileDir, 'info.json');
    
    await writeFile(infoPath, JSON.stringify(updatedInfo, null, 2));
    
    return true;
  } catch (error) {
    console.error('更新文件信息錯誤:', error);
    return false;
  }
}

// 更新處理狀態
export async function updateProcessingStatus(
  fileId: string,
  taskType: 'humanVoiceSeparation' | 'speakerDiarization' | 'noiseReduction',
  status: ProcessingStatus,
  progress: number = 0,
  error?: string
) {
  try {
    const fileInfo = await getFileInfo(fileId);
    
    if (!fileInfo) {
      return false;
    }
    
    const processingStatus = {
      ...fileInfo.processingStatus,
      [taskType]: status
    };
    
    const updates = {
      processingStatus,
      [`${taskType}Progress`]: progress
    };
    
    if (error) {
      updates[`${taskType}Error`] = error;
    }
    
    return await updateFileInfo(fileId, updates);
  } catch (error) {
    console.error('更新處理狀態錯誤:', error);
    return false;
  }
}

// 獲取處理狀態
export async function getProcessingStatus(fileId: string) {
  try {
    const fileInfo = await getFileInfo(fileId);
    
    if (!fileInfo) {
      return null;
    }
    
    return {
      fileId,
      originalName: fileInfo.originalName,
      uploadedAt: fileInfo.uploadedAt,
      expiresAt: fileInfo.expiresAt,
      status: fileInfo.status,
      processingStatus: fileInfo.processingStatus,
      humanVoiceProgress: fileInfo.humanVoiceProgress || 0,
      speakerDiarizationProgress: fileInfo.speakerDiarizationProgress || 0,
      noiseReductionProgress: fileInfo.noiseReductionProgress || 0,
      results: fileInfo.results || {}
    };
  } catch (error) {
    console.error('獲取處理狀態錯誤:', error);
    return null;
  }
}

// 添加處理結果
export async function addProcessingResult(
  fileId: string,
  taskType: 'humanVoiceSeparation' | 'speakerDiarization' | 'noiseReduction',
  resultPath: string
) {
  try {
    const fileInfo = await getFileInfo(fileId);
    
    if (!fileInfo) {
      return false;
    }
    
    const results = fileInfo.results || {};
    results[taskType] = resultPath;
    
    return await updateFileInfo(fileId, { results });
  } catch (error) {
    console.error('添加處理結果錯誤:', error);
    return false;
  }
}

// 檢查所有處理是否完成
export async function checkAllProcessingCompleted(fileId: string) {
  try {
    const fileInfo = await getFileInfo(fileId);
    
    if (!fileInfo) {
      return false;
    }
    
    const { processingStatus } = fileInfo;
    
    const allCompleted = 
      processingStatus.humanVoiceSeparation === 'completed' &&
      processingStatus.speakerDiarization === 'completed' &&
      processingStatus.noiseReduction === 'completed';
    
    if (allCompleted) {
      await updateFileInfo(fileId, { status: 'completed' });
    }
    
    return allCompleted;
  } catch (error) {
    console.error('檢查處理完成錯誤:', error);
    return false;
  }
}

// 獲取過期文件列表
export async function getExpiredFiles() {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    if (!existsSync(uploadsDir)) {
      return [];
    }
    
    const now = new Date();
    const expiredFiles = [];
    
    // 這裡需要實現目錄遍歷和文件信息讀取
    // 由於在瀏覽器環境中無法直接讀取目錄，這部分需要在服務器端實現
    
    return expiredFiles;
  } catch (error) {
    console.error('獲取過期文件錯誤:', error);
    return [];
  }
}
