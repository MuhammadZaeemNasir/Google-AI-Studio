import React from 'react';
import Header from './components/Header';
import Chat from './components/Chat';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-hidden relative flex flex-col items-center">
        <div className="w-full max-w-4xl h-full flex flex-col relative bg-slate-900/50 sm:border-x border-slate-800 shadow-2xl">
          <Chat />
        </div>
      </main>
    </div>
  );
};

export default App;