import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">💡 IdeaConnect</h1>
          <p className="text-purple-100 mt-1">
            생각을 연결하고, 지혜를 발견하는 지식 네트워크
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Made with Claude Code
        </div>
      </footer>
    </div>
  );
}
