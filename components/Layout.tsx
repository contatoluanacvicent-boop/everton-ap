
import React from 'react';
import { useStore } from '../context/StoreContext';
import { ADMIN_MENU, CLIENT_MENU } from '../constants';
import { LogOut, Bell } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePath: string;
  onNavigate: (path: string) => void;
}

export const DashboardLayout: React.FC<LayoutProps> = ({ children, activePath, onNavigate }) => {
  const { currentUser, logout } = useStore();
  const menu = currentUser?.role === 'admin' ? ADMIN_MENU : CLIENT_MENU;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950 font-sans text-gray-100">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-primary border-r border-gray-800">
        <div className="p-6">
          <h1 className="text-xl font-bold text-secondary uppercase tracking-widest">Everton Cortes</h1>
          <p className="text-xs text-gray-400 mt-1">Barbearia & Estética</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 py-4">
          {menu.map((item) => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activePath === item.path 
                  ? 'bg-secondary text-white shadow-lg shadow-blue-500/20' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair da Conta</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-950 overflow-y-auto custom-scrollbar">
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="md:hidden text-lg font-bold text-secondary">E.C.</div>
            <h2 className="text-lg font-semibold truncate">
              {menu.find(m => m.path === activePath)?.label || 'Bem-vindo'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-950"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{currentUser?.name}</p>
                <p className="text-xs text-gray-400 capitalize">{currentUser?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-white uppercase">
                {currentUser?.name?.[0]}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto w-full">
          {children}
        </div>

        {/* Bottom Nav Mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-primary border-t border-gray-800 flex justify-around items-center py-2 px-4 z-40">
          {menu.slice(0, 5).map((item) => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                activePath === item.path ? 'text-secondary' : 'text-gray-500'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
};
