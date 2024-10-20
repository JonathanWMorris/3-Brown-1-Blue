"use client";
import React, { useState, FormEvent } from 'react';
import { ArrowRightIcon, MoonIcon, SunIcon } from '@heroicons/react/24/solid';

export default function Home() {
  const [prompt, setPrompt] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/backend/generate_video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setVideoUrl(data.videoUrl);
      setPrompt('');
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <main className={`flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
    }`}>
      <div className={`relative w-full max-w-4xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white bg-opacity-90'
      } backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-8`}>
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out"
        >
          {isDarkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-600" />
          )}
        </button>

        <h1 className={`text-5xl font-extrabold text-center ${
          isDarkMode ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'
        }`}>
          AI Video Generator
        </h1>
        
        <div className="w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg">
          {videoUrl ? (
            <video src={videoUrl} controls className="w-full h-full object-cover">
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xl font-semibold">
              {isLoading ? "Generating your video..." : "Your video will appear here"}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the video you want to generate..."
            className={`flex-grow p-4 ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-white bg-opacity-50'
            } backdrop-blur-sm border-2 ${
              isDarkMode ? 'border-gray-600' : 'border-purple-300'
            } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg placeholder-gray-500 transition duration-300 ease-in-out`}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`p-4 ${
              isLoading ? 'bg-gray-400' : isDarkMode ? 'bg-purple-700 hover:bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'
            } text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-50`}
          >
            {isLoading ? (
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <ArrowRightIcon className="h-6 w-6" />
            )}
          </button>
        </form>
      </div>
    </main>
  );
}