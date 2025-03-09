'use client';

import React, { useState } from 'react';

interface DownloadButtonProps {
  fileId: string;
  fileName: string;
  label: string;
  className?: string;
}

export default function DownloadButton({ fileId, fileName, label, className }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  
  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError('');
      
      // 獲取下載URL
      const response = await fetch(`/api/audio/download/${fileId}/${fileName}`);
      
      if (!response.ok) {
        throw new Error('獲取下載URL失敗');
      }
      
      const data = await response.json();
      
      // 使用獲取到的URL進行下載
      // 在實際應用中，這裡應該直接下載文件
      // 由於我們使用的是模擬處理，這裡只是模擬下載過程
      
      // 創建一個臨時的a標籤來觸發下載
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloading(false);
      
    } catch (error) {
      console.error('下載文件錯誤:', error);
      setError('下載文件失敗');
      setDownloading(false);
    }
  };
  
  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className={`py-2 px-4 rounded ${className || 'bg-blue-600 hover:bg-blue-700 text-white'} ${
          downloading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {downloading ? '下載中...' : label}
      </button>
      
      {error && (
        <p className="text-red-600 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
