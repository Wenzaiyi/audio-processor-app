'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    // 檢查文件格式
    const acceptedFormats = ['audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/aac', 'audio/ogg', 'audio/flac', 'audio/x-ms-wma'];
    const selectedFile = acceptedFiles[0];
    
    if (!selectedFile) return;
    
    // 檢查文件類型
    if (!acceptedFormats.includes(selectedFile.type)) {
      setError('不支持的文件格式。請上傳 mp3, wav, m4a, aac, ogg, flac 或 wma 格式的文件。');
      return;
    }
    
    // 檢查文件大小 (50MB = 52428800 bytes)
    if (selectedFile.size > 52428800) {
      setError('文件大小超過限制。最大允許 50MB。');
      return;
    }
    
    setFile(selectedFile);
    setError('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac', '.wma']
    },
    maxSize: 52428800, // 50MB
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    // 創建 FormData 對象
    const formData = new FormData();
    formData.append('audioFile', file);
    
    try {
      // 模擬上傳進度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 300);
      
      // 發送文件到後端
      const response = await fetch('/api/audio/upload', {
        method: 'POST',
        body: formData
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        throw new Error('上傳失敗');
      }
      
      const data = await response.json();
      setUploadProgress(100);
      
      // 上傳成功後跳轉到處理頁面
      setTimeout(() => {
        router.push(`/process/${data.fileId}`);
      }, 1000);
      
    } catch (err) {
      setError('上傳失敗：' + err.message);
      setUploading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">上傳音頻文件</h1>
        
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          <input {...getInputProps()} />
          
          {isDragActive ? (
            <p className="text-lg text-blue-600">將文件放在這裡...</p>
          ) : (
            <div>
              <p className="text-lg mb-2">拖拽文件到此處，或點擊選擇文件</p>
              <p className="text-sm text-gray-500">
                支持的格式：mp3, wav, m4a, aac, ogg, flac, wma<br />
                最大文件大小：50MB
              </p>
            </div>
          )}
        </div>
        
        {file && (
          <div className="mt-6">
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button 
                onClick={() => setFile(null)}
                className="text-red-500 hover:text-red-700"
              >
                移除
              </button>
            </div>
            
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`w-full mt-4 py-3 px-6 rounded-lg text-white font-medium ${
                uploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {uploading ? '上傳中...' : '開始上傳'}
            </button>
          </div>
        )}
        
        {uploading && (
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-center mt-2">{uploadProgress}%</p>
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
