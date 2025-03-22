'use client';

import { useState } from 'react';

export default function TestPage() {
  const [counter, setCounter] = useState(0);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p className="mb-4">This is a simple test page to verify Next.js rendering.</p>
      
      <div className="p-4 border rounded-md mb-4">
        <p className="mb-2">Counter: {counter}</p>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => setCounter(prev => prev + 1)}
        >
          Increment
        </button>
      </div>
      
      <p className="text-sm text-gray-500">
        If you're seeing this page, basic Next.js rendering is working correctly.
      </p>
    </div>
  );
} 