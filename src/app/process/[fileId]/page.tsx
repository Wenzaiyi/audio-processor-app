'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 模擬人聲分離處理
const simulateHumanVoiceSeparation = async (fileId: string) => {
  try {
    // 啟動人聲分離處理
    const response = await fetch(`/api/audio/process/${fileId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskType: 'humanVoiceSeparation' }),
    });
    
    if (!response.ok) {
      throw new Error('啟動人聲分離處理失敗');
    }
    
    return true;
  } catch (error) {
    console.error('人聲分離處理錯誤:', error);
    return false;
  }
};

// 模擬說話者分離處理
const simulateSpeakerDiarization = async (fileId: string) => {
  try {
    // 啟動說話者分離處理
    const response = await fetch(`/api/audio/process/${fileId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskType: 'speakerDiarization' }),
    });
    
    if (!response.ok) {
      throw new Error('啟動說話者分離處理失敗');
    }
    
    return true;
  } catch (error) {
    console.error('說話者分離處理錯誤:', error);
    return false;
  }
};

// 模擬音頻降噪處理
const simulateNoiseReduction = async (fileId: string) => {
  try {
    // 啟動音頻降噪處理
    const response = await fetch(`/api/audio/process/${fileId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskType: 'noiseReduction' }),
    });
    
    if (!response.ok) {
      throw new Error('啟動音頻降噪處理失敗');
    }
    
    return true;
  } catch (error) {
    console.error('音頻降噪處理錯誤:', error);
    return false;
  }
};

interface ProcessPageProps {
  params: {
    fileId: string;
  };
}

export default function ProcessPage({ params }: ProcessPageProps) {
  const { fileId } = params;
  const router = useRouter();
  
  const [processingStatus, setProcessingStatus] = useState({
    humanVoiceSeparation: 'pending',
    speakerDiarization: 'pending',
    noiseReduction: 'pending',
  });
  
  const [progress, setProgress] = useState({
    humanVoiceProgress: 0,
    speakerDiarizationProgress: 0,
    noiseReductionProgress: 0,
  });
  
  const [allCompleted, setAllCompleted] = useState(false);
  const [error, setError] = useState('');
  
  // 獲取處理狀態
  const fetchProcessingStatus = async () => {
    try {
      const response = await fetch(`/api/audio/status/${fileId}`);
      
      if (!response.ok) {
        throw new Error('獲取處理狀態失敗');
      }
      
      const data = await response.json();
      
      setProcessingStatus(data.processingStatus);
      setProgress({
        humanVoiceProgress: data.humanVoiceProgress || 0,
        speakerDiarizationProgress: data.speakerDiarizationProgress || 0,
        noiseReductionProgress: data.noiseReductionProgress || 0,
      });
      
      // 檢查是否所有處理都已完成
      const allCompleted = 
        data.processingStatus.humanVoiceSeparation === 'completed' &&
        data.processingStatus.speakerDiarization === 'completed' &&
        data.processingStatus.noiseReduction === 'completed';
      
      setAllCompleted(allCompleted);
      
      if (allCompleted) {
        // 如果所有處理都已完成，跳轉到結果頁面
        setTimeout(() => {
          router.push(`/result/${fileId}`);
        }, 2000);
      }
      
    } catch (error) {
      console.error('獲取處理狀態錯誤:', error);
      setError('獲取處理狀態失敗');
    }
  };
  
  // 啟動所有處理任務
  const startAllProcessing = async () => {
    try {
      // 啟動人聲分離處理
      await simulateHumanVoiceSeparation(fileId);
      
      // 啟動說話者分離處理
      await simulateSpeakerDiarization(fileId);
      
      // 啟動音頻降噪處理
      await simulateNoiseReduction(fileId);
      
    } catch (error) {
      console.error('啟動處理任務錯誤:', error);
      setError('啟動處理任務失敗');
    }
  };
  
  // 初始化時啟動所有處理任務
  useEffect(() => {
    startAllProcessing();
    
    // 定期獲取處理狀態
    const statusInterval = setInterval(fetchProcessingStatus, 2000);
    
    return () => {
      clearInterval(statusInterval);
    };
  }, [fileId]);
  
  // 獲取狀態文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '等待處理...';
      case 'processing':
        return '處理中...';
      case 'completed':
        return '處理完成';
      case 'failed':
        return '處理失敗';
      default:
        return '未知狀態';
    }
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">音頻處理中</h1>
        
        <div className="mb-8">
          <p className="text-center text-gray-600 mb-4">
            您的文件已上傳成功，正在進行處理。請勿關閉此頁面。
          </p>
          {!allCompleted && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">人聲分離</h2>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress.humanVoiceProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {getStatusText(processingStatus.humanVoiceSeparation)}
              {processingStatus.humanVoiceSeparation === 'processing' && ` (${progress.humanVoiceProgress}%)`}
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">說話者分離</h2>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress.speakerDiarizationProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {getStatusText(processingStatus.speakerDiarization)}
              {processingStatus.speakerDiarization === 'processing' && ` (${progress.speakerDiarizationProgress}%)`}
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">音頻降噪</h2>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress.noiseReductionProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {getStatusText(processingStatus.noiseReduction)}
              {processingStatus.noiseReduction === 'processing' && ` (${progress.noiseReductionProgress}%)`}
            </p>
          </div>
        </div>
        
        {allCompleted && (
          <div className="mt-8 text-center">
            <p className="text-green-600 font-medium mb-4">所有處理已完成，即將跳轉到結果頁面...</p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <a href="/" className="text-blue-600 hover:underline">返回首頁</a>
        </div>
      </div>
    </main>
  );
}
