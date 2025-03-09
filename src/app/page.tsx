import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">音頻處理應用</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">功能介紹</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-medium">人聲分離</h3>
              <p className="text-gray-600">將人聲從背景音樂/環境音中分離出來</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-xl font-medium">說話者分離</h3>
              <p className="text-gray-600">識別並分離不同說話者的聲音</p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-xl font-medium">音頻降噪</h3>
              <p className="text-gray-600">降低背景噪音，提高音頻質量</p>
            </div>
          </div>
          
          <div className="mt-8">
            <Link 
              href="/upload" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              開始處理音頻
            </Link>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">支持的格式</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac', 'wma'].map((format) => (
              <div key={format} className="bg-gray-100 p-3 rounded-md text-center">
                <span className="font-medium">.{format}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-gray-600">最大文件大小：50MB</p>
        </div>
      </div>
    </main>
  );
}
