
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { LogIn, User as UserIcon, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'cliente' | 'admin'>('cliente');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) login(email, role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-6">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-secondary mb-6 shadow-2xl shadow-blue-500/20">
            <LogIn className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">EVERTON CORTES</h1>
          <p className="text-gray-400 uppercase tracking-[0.2em] text-xs font-bold">Barbearia Profissional</p>
        </div>

        <div className="bg-primary border border-gray-800 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">E-mail de acesso</label>
              <input
                type="email"
                required
                className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-4 uppercase tracking-wide">Eu sou...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('cliente')}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                    role === 'cliente' ? 'border-secondary bg-secondary/10 text-white' : 'border-gray-800 text-gray-500 grayscale'
                  }`}
                >
                  <UserIcon className="w-8 h-8" />
                  <span className="font-bold text-sm">Cliente</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                    role === 'admin' ? 'border-secondary bg-secondary/10 text-white' : 'border-gray-800 text-gray-500 grayscale'
                  }`}
                >
                  <ShieldCheck className="w-8 h-8" />
                  <span className="font-bold text-sm">Administrador</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-secondary hover:bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 transform transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              ENTRAR NO SISTEMA
            </button>
          </form>
        </div>
        
        <p className="text-center text-gray-500 text-xs mt-8 font-medium">
          &copy; 2024 Barbearia Everton dos Cortes. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};
