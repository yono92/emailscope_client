import React, { useState, useEffect } from 'react';
import EmlUpload from './components/EmlUpload';
import { FaSun, FaMoon } from 'react-icons/fa';

const App: React.FC = () => {
  // 시스템 다크모드 설정에 따라 초기 상태 설정
  const getInitialMode = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedMode = window.localStorage.getItem('darkMode');
      if (savedMode) {
        return savedMode === 'true';
      }
      const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
      return userMedia.matches;
    }
    return false; // 기본값
  };

  const [darkMode, setDarkMode] = useState(getInitialMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    window.localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className="w-full bg-gray-800 p-4 text-center">
        <h1 className="text-3xl font-bold">EmailScope</h1>
      </header>
      <main className="flex flex-grow items-center justify-center w-full">
        <EmlUpload />
      </main>
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-4 right-4 bg-gray-700 text-white p-3 rounded-full shadow-lg"
      >
        {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
      </button>
    </div>
  );
};

export default App;
