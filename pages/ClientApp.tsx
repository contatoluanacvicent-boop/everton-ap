
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Award, ShoppingBag, Clock, Star, MapPin, ChevronRight, Check, Calendar, Wallet } from 'lucide-react';

export const ClientHome: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser, services, products, bookings } = useStore();

  const activeOffers = products.slice(0, 2);
  const myBookings = bookings.filter(b => b.userId === currentUser?.id && b.status === 'pending');

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-900 p-8 text-white shadow-2xl">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Fala, {currentUser?.name}! 👋</h2>
          <p className="text-blue-100 mb-6 opacity-90 leading-relaxed">Pronto para dar aquele trato no visual hoje? Temos horários disponíveis!</p>
          <button 
            onClick={() => onNavigate('/app/agendar')}
            className="bg-white text-blue-700 font-bold px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition-transform active:scale-95"
          >
            Agendar Agora
          </button>
        </div>
        {/* Abstract shapes */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl"></div>
      </section>

      {/* My Appointments - New Section */}
      {myBookings.length > 0 && (
        <section className="animate-in fade-in duration-700">
           <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary" /> Seus Agendamentos
            </h3>
          </div>
          <div className="space-y-4">
            {myBookings.map(b => (
              <div key={b.id} className="bg-primary p-5 rounded-2xl border border-gray-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                      <Clock className="text-secondary" />
                   </div>
                   <div>
                      <h4 className="font-bold">{b.serviceName}</h4>
                      <p className="text-xs text-gray-500">{new Date(b.date).toLocaleDateString('pt-BR')} às {b.time}</p>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                  {b.amountRemaining > 0 && (
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Saldo no Local</p>
                      <p className="text-lg font-black text-orange-400 flex items-center gap-1 justify-end">
                        <Wallet size={16}/> R$ {b.amountRemaining}
                      </p>
                    </div>
                  )}
                  <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                    <span className="text-[10px] font-bold text-green-400 uppercase">Confirmado</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Fidelity Status */}
      <section className="bg-primary p-6 rounded-2xl border border-gray-800 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Award className="text-yellow-500 w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg">Seu Cartão Fidelidade</h3>
          </div>
          <span className="text-sm font-medium text-gray-400">{currentUser?.fidelityPoints}/10 cortes</span>
        </div>
        
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                i < (currentUser?.fidelityPoints || 0) 
                  ? 'bg-secondary border-secondary shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                  : 'border-gray-700 bg-gray-900'
              }`}
            >
              {i < (currentUser?.fidelityPoints || 0) && <Check className="w-5 h-5 text-white" />}
            </div>
          ))}
        </div>
        
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
          <p className="text-sm text-blue-200">
            Faltam apenas <span className="font-bold">{(10 - (currentUser?.fidelityPoints || 0))} agendamentos</span> para você ganhar um corte totalmente grátis! ✂️
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" /> Nossos Serviços
          </h3>
          <button className="text-secondary text-sm font-semibold hover:underline">Ver todos</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div key={service.id} className="group bg-primary rounded-2xl border border-gray-800 overflow-hidden hover:border-secondary transition-all cursor-pointer shadow-lg">
              <div className="relative h-48 overflow-hidden">
                <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-gray-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {service.category}
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-lg mb-1">{service.name}</h4>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-secondary font-extrabold text-xl">R$ {service.price}</span>
                  <button 
                    onClick={() => onNavigate('/app/agendar')}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Store Highlights */}
      <section className="bg-gray-900 rounded-3xl p-8 border border-gray-800">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <ShoppingBag className="text-secondary" /> Loja do Everton
            </h3>
            <p className="text-gray-400 mb-6 max-w-md">Cuide do seu visual em casa com os mesmos produtos que usamos aqui na barbearia. Qualidade profissional garantida.</p>
            <button 
              onClick={() => onNavigate('/app/produtos')}
              className="px-6 py-3 bg-secondary rounded-xl font-bold shadow-lg shadow-blue-500/20"
            >
              Explorar Loja
            </button>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4 w-full">
            {activeOffers.map(product => (
              <div key={product.id} className="bg-primary p-4 rounded-2xl border border-gray-800 shadow-xl">
                <img src={product.image} className="w-full h-24 object-cover rounded-lg mb-3" />
                <p className="text-xs font-bold text-gray-500 truncate">{product.name}</p>
                <p className="text-sm font-bold text-white">R$ {product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
