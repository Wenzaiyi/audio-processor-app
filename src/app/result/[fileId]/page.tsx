'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DownloadButton from '@/components/audio/DownloadButton';

interface ResultPageProps {
  params: {
    fileId: string;
  };
}

export default function ResultPage({ params }: ResultPageProps) {
  const { fileId } = params;
  
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 獲取文件信息和處理結果
  useEffect(() => {
    const fetchFileInfo = async () => {
      try {
        const response = await fetch(`/api/audio/status/${fileId}`);
        
        if (!response.ok) {
          throw new Error('獲取文件信息失敗');
        }
        
        const data = await response.json();
        setFileInfo(data);
        setLoading(false);
      } catch (error) {
        console.error('獲取文件信息錯誤:', error);
        setError('獲取文件信息失敗');
        setLoading(false);
      }
    };
    
    fetchFileInfo();
  }, [fileId]);
  
  // 計算剩餘保存時間
  const getRemainingTime = (expiresAt: string) => {
    const now = new Date();
    const expireDate = new Date(expiresAt);
    const diffTime = expireDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? `${diffDays} 天` : '即將過期';
  };
  
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center mb-6">加載處理結果</h1>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </main>
    );
  }
  
  if (error || !fileInfo) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center mb-6">錯誤</h1>
          <p className="text-center text-red-600">{error || '無法獲取處理結果'}</p>
          <div className="mt-8 text-center">
            <Link href="/" className="text-blue-600 hover:underline">返回首頁</Link>
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">處理結果</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">文件信息</h2>
          <div className="bg-gray-100 p-4 rounded-md">
            <p><span className="font-medium">原始文件名：</span> {fileInfo.originalName}</p>
            <p><span className="font-medium">上傳時間：</span> {new Date(fileInfo.uploadedAt).toLocaleString()}</p>
            <p><span className="font-medium">文件將保存：</span> {getRemainingTime(fileInfo.expiresAt)}</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">人聲分離</h2>
            <div className="bg-gray-100 p-4 rounded-md">
              {fileInfo.processingStatus.humanVoiceSeparation === 'completed' ? (
                <div>
                  <p className="text-green-600 mb-2">處理完成</p>
                  <div className="flex space-x-2">
                    <DownloadButton 
                      fileId={fileId} 
                      fileName="vocals.wav" 
                      label="下載人聲"
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    />
                    <DownloadButton 
                      fileId={fileId} 
                      fileName="accompaniment.wav" 
                      label="下載背景音樂"
                      className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-red-600">處理失敗或未完成</p>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">說話者分離</h2>
            <div className="bg-gray-100 p-4 rounded-md">
              {fileInfo.processingStatus.speakerDiarization === 'completed' ? (
                <div>
                  <p className="text-green-600 mb-2">處理完成</p>
                  <div className="flex space-x-2">
                    <DownloadButton 
                      fileId={fileId} 
                      fileName="speaker1.wav" 
                      label="下載說話者 1"
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                    />
                    <DownloadButton 
                      fileId={fileId} 
                      fileName="speaker2.wav" 
                      label="下載說話者 2"
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-red-600">處理失敗或未完成</p>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">音頻降噪</h2>
            <div className="bg-gray-100 p-4 rounded-md">
              {fileInfo.processingStatus.noiseReduction === 'completed' ? (
                <div>
                  <p className="text-green-600 mb-2">處理完成</p>
                  <div className="flex space-x-2">
                    <DownloadButton 
                      fileId={fileId} 
                      fileName="denoised.wav" 
                      label="下載降噪後音頻"
                      className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-red-600">處理失敗或未完成</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:underline">返回首頁</Link>
        </div>
      </div>
    </main>
  );
}
