import { readdir, unlink, rmdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { getFileInfo } from './processing-queue';

// 檢查並刪除過期文件
export async function checkAndDeleteExpiredFiles() {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    if (!existsSync(uploadsDir)) {
      console.log('上傳目錄不存在');
      return;
    }
    
    // 獲取所有文件夾（每個文件夾代表一個上傳的文件）
    const fileDirs = await readdir(uploadsDir);
    const now = new Date();
    
    for (const fileId of fileDirs) {
      const fileDir = join(uploadsDir, fileId);
      const infoPath = join(fileDir, 'info.json');
      
      // 檢查文件信息是否存在
      if (!existsSync(infoPath)) {
        continue;
      }
      
      // 獲取文件信息
      const fileInfo = await getFileInfo(fileId);
      
      if (!fileInfo) {
        continue;
      }
      
      // 檢查文件是否過期
      const expiresAt = new Date(fileInfo.expiresAt);
      
      if (now > expiresAt) {
        console.log(`刪除過期文件: ${fileId}`);
        
        // 獲取目錄中的所有文件
        const files = await readdir(fileDir);
        
        // 刪除所有文件
        for (const file of files) {
          await unlink(join(fileDir, file));
        }
        
        // 刪除目錄
        await rmdir(fileDir);
      }
    }
    
    console.log('過期文件檢查完成');
    
  } catch (error) {
    console.error('檢查過期文件錯誤:', error);
  }
}

// 啟動定期檢查
export function startAutoDeletionSchedule() {
  // 立即執行一次檢查
  checkAndDeleteExpiredFiles();
  
  // 設置定期檢查（每天執行一次）
  const ONE_DAY = 24 * 60 * 60 * 1000; // 24小時（毫秒）
  setInterval(checkAndDeleteExpiredFiles, ONE_DAY);
  
  console.log('自動刪除機制已啟動');
}
