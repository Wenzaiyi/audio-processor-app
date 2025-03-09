'use client';

import React, { useState, useEffect } from 'react';

interface ProgressTrackerProps {
  fileId: string;
  onComplete?: () => void;
}

export default function ProgressTracker({ fileId, onComplete }: ProgressTrackerProps) {
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
      
      if (allCompleted && onComplete) {
        onComplete();
      }
      
    } catch (error) {
      console.error('獲取處理狀態錯誤:', error);
      setError('獲取處理狀態失敗');
    }
  };
  
  // 初始化時開始獲取處理狀態
  useEffect(() => {
    // 立即獲取一次狀態
    fetchProcessingStatus();
    
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
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}
