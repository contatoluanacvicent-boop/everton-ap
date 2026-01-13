
import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardLayout } from './components/Layout';
import { AdminDashboard } from './pages/AdminDashboard';
import { ClientHome } from './pages/ClientApp';
import { BookingPage } from './pages/BookingPage';
import { 
  ShoppingBag, Box, Scissors, Users, Settings, Plus, LayoutGrid, 
  Calendar as CalendarIcon, Award, CreditCard, XCircle, UserX, CheckCircle, Clock, Check, Wallet
} from 'lucide-react';

const Router: React.FC = () => {
  const { currentUser } = useStore();
  const [activePath, setActivePath] = useState(currentUser?.role === 'admin' ? '/admin' : '/app');

  useEffect(() => {
    if (currentUser) {
      setActivePath(currentUser.role === 'admin' ? '/admin' : '/app');
    }
  }, [currentUser]);

  if (!currentUser) return <LoginPage />;

  const renderAdminContent = () => {
    switch (activePath) {
      case '/admin': return <AdminDashboard />;
      case '/admin/agenda': return <AdminAgenda />;
      case '/admin/estoque': return <AdminInventory />;
      case '/admin/servicos': return <AdminServices />;
      case '/admin/clientes': return <AdminClients />;
      case '/admin/config': return <AdminConfig />;
      default: return <AdminDashboard />;
    }
  };

  const renderClientContent = () => {
    switch (activePath) {
      case '/app': return <ClientHome onNavigate={setActivePath} />;
      case '/app/agendar': return <BookingPage onComplete={() => setActivePath('/app')} />;
      case '/app/produtos': return <ProductShop />;
      case '/app/fidelidade': return <FidelityPage />;
      case '/app/galeria': return <GalleryPage />;
      default: return <ClientHome onNavigate={setActivePath} />;
    }
  };

  return (
    <DashboardLayout activePath={activePath} onNavigate={setActivePath}>
      {currentUser.role === 'admin' ? renderAdminContent() : renderClientContent()}
    </DashboardLayout>
  );
};

// --- Admin Components with Payment/Cancellation logic ---

const AdminAgenda: React.FC = () => {
  const { bookings, updateBooking, cancelBooking, payRemainingBalance, settings } = useStore();
  
  const isLateCancellation = (bookingDate: string, bookingTime: string) => {
    const bookingDateTime = new Date(`${bookingDate}T${bookingTime}`);
    const now = new Date();
    const diffInMs = bookingDateTime.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return diffInHours < settings.cancellationNoticeHours;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold">Gestão da Agenda</h3>
          <p className="text-sm text-gray-500">Acompanhe pagamentos e gerencie cancelamentos.</p>
        </div>
        <button className="bg-secondary px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-500/20">
          <Plus size={20}/> Novo Horário
        </button>
      </div>

      <div className="bg-primary rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-900 border-b border-gray-800">
              <tr>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Cliente</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Serviço / Valor</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Horário</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Pagamento</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {bookings.length > 0 ? bookings.map((b) => {
                const late = isLateCancellation(b.date, b.time);
                return (
                  <tr key={b.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center font-bold text-secondary uppercase">
                          {b.userName[0]}
                        </div>
                        <span className="font-bold">{b.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{b.serviceName}</div>
                      <div className="text-xs text-gray-500">R$ {b.totalPrice}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-secondary">{b.time}</div>
                      <div className="text-xs text-gray-500">{new Date(b.date).toLocaleDateString('pt-BR')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase inline-block w-fit ${
                          b.paymentStatus === 'full' ? 'bg-green-500/20 text-green-400' : 
                          b.paymentStatus === 'partial' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {b.paymentStatus === 'full' ? 'Pago Total' : b.paymentStatus === 'partial' ? `Saldo Pendente` : 'Pendente'}
                        </span>
                        {b.amountRemaining > 0 && (
                           <button 
                            onClick={() => payRemainingBalance(b.id)}
                            className="text-[10px] text-secondary font-bold hover:underline flex items-center gap-1"
                           >
                            <Wallet size={10}/> Receber R$ {b.amountRemaining}
                           </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {b.status === 'pending' && (
                          <>
                            <button 
                              title="Concluir Atendimento"
                              onClick={() => updateBooking(b.id, { status: 'completed' })}
                              className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500 transition-colors hover:text-white"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button 
                              title="No-Show (Não compareceu - Cobra Taxa)"
                              onClick={() => cancelBooking(b.id, true)}
                              className="p-2 bg-orange-500/10 text-orange-400 rounded-lg hover:bg-orange-500 transition-colors hover:text-white"
                            >
                              <UserX size={18} />
                            </button>
                            <button 
                              title={late ? `Cancelar com Taxa (Menos de ${settings.cancellationNoticeHours}h)` : "Cancelar sem Taxa"}
                              onClick={() => cancelBooking(b.id, late)}
                              className={`p-2 rounded-lg transition-colors hover:text-white ${
                                late ? 'bg-red-500/10 text-red-400 hover:bg-red-500' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                              }`}
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        {b.status === 'completed' && <span className="text-xs text-green-500 font-bold flex items-center gap-1"><CheckCircle size={14}/> Concluído</span>}
                        {b.status === 'cancelled' && <span className="text-xs text-red-500 italic">Cancelado</span>}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-500">
                     <CalendarIcon className="mx-auto mb-3 opacity-20" size={48} />
                     <p>Nenhum agendamento registrado para hoje.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminConfig: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const handleUpdate = (newSettings: Partial<typeof settings>) => {
    updateSettings(newSettings);
    setSavedStatus('Configuração salva!');
    setTimeout(() => setSavedStatus(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Settings className="text-secondary w-8 h-8" />
          <div>
            <h3 className="text-2xl font-bold">Configurações Gerais</h3>
            <p className="text-sm text-gray-500">Ajuste as regras de negócio da barbearia.</p>
          </div>
        </div>
        {savedStatus && (
          <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 animate-bounce">
            <Check size={16} /> {savedStatus}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Cancellation Fee Percent */}
        <div className="bg-primary p-6 rounded-3xl border border-gray-800 shadow-xl">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-500/10 rounded-xl text-red-500"><XCircle size={24}/></div>
              <h4 className="font-bold">Taxa de Cancelamento</h4>
           </div>
           <div className="space-y-4">
              <label className="text-xs text-gray-500 uppercase font-black block tracking-widest">Percentual da Taxa</label>
              <div className="flex items-center gap-3 bg-gray-950 p-4 rounded-2xl border border-gray-800 focus-within:border-secondary transition-all">
                <input 
                  type="number" 
                  value={settings.cancellationFeePercent} 
                  onChange={(e) => handleUpdate({ cancellationFeePercent: Number(e.target.value) })}
                  className="bg-transparent text-2xl font-black w-full focus:outline-none" 
                />
                <span className="text-gray-400 font-bold">%</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed italic">Cobrado automaticamente em casos de cancelamento fora do prazo ou no-show.</p>
           </div>
        </div>

        {/* Cancellation Notice Hours */}
        <div className="bg-primary p-6 rounded-3xl border border-gray-800 shadow-xl">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500"><Clock size={24}/></div>
              <h4 className="font-bold">Janela de Cancelamento</h4>
           </div>
           <div className="space-y-4">
              <label className="text-xs text-gray-500 uppercase font-black block tracking-widest">Antecedência (Horas)</label>
              <div className="flex items-center gap-3 bg-gray-950 p-4 rounded-2xl border border-gray-800 focus-within:border-secondary transition-all">
                <input 
                  type="number" 
                  value={settings.cancellationNoticeHours} 
                  onChange={(e) => handleUpdate({ cancellationNoticeHours: Number(e.target.value) })}
                  className="bg-transparent text-2xl font-black w-full focus:outline-none" 
                />
                <span className="text-gray-400 font-bold">h</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed italic text-secondary font-bold">Padrão: 1h. O cliente pode cancelar livremente até este prazo antes do serviço.</p>
           </div>
        </div>

        {/* Advance Payment Percent */}
        <div className="bg-primary p-6 rounded-3xl border border-gray-800 shadow-xl">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><CreditCard size={24}/></div>
              <h4 className="font-bold">Pagamento Prévio</h4>
           </div>
           <div className="space-y-4">
              <label className="text-xs text-gray-500 uppercase font-black block tracking-widest">Mínimo p/ Reserva</label>
              <div className="flex items-center gap-3 bg-gray-950 p-4 rounded-2xl border border-gray-800 focus-within:border-secondary transition-all">
                <input 
                  type="number" 
                  value={settings.advancePaymentMinPercent} 
                  onChange={(e) => handleUpdate({ advancePaymentMinPercent: Number(e.target.value) })}
                  className="bg-transparent text-2xl font-black w-full focus:outline-none" 
                />
                <span className="text-gray-400 font-bold">%</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed italic">Valor obrigatório (50% ou 100%) que o cliente deve pagar para confirmar o horário.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const AdminInventory: React.FC = () => {
  const { products } = useStore();
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Controle de Estoque</h3>
        <button className="bg-secondary p-3 rounded-xl flex items-center gap-2 font-bold"><Plus size={20}/> Produto</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-primary p-6 rounded-2xl border border-gray-800 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <img src={p.image} className="w-16 h-16 rounded-xl object-cover" />
              <span className={`px-3 py-1 rounded-full text-[10px] font-black ${p.stock < 10 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {p.stock} EM ESTOQUE
              </span>
            </div>
            <h4 className="font-bold text-lg mb-1">{p.name}</h4>
            <p className="text-xs text-gray-500 mb-4">{p.category}</p>
            <div className="flex justify-between items-center pt-4 border-t border-gray-800">
              <span className="text-xl font-black text-secondary">R$ {p.price}</span>
              <div className="flex gap-2">
                <button className="p-2 bg-gray-800 rounded-lg text-xs font-bold">Editar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminServices: React.FC = () => {
  const { services } = useStore();
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Catálogo de Serviços</h3>
      <div className="grid grid-cols-1 gap-4">
        {services.map(s => (
          <div key={s.id} className="flex items-center justify-between p-6 bg-primary rounded-2xl border border-gray-800 shadow-xl">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center">
                   <Scissors className="text-secondary" />
                </div>
                <div>
                   <h4 className="font-bold text-lg">{s.name}</h4>
                   <p className="text-xs text-gray-500">{s.duration} min • Custo Médio: R$ 12,00</p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-2xl font-black text-secondary">R$ {s.price}</p>
                <button className="text-[10px] font-bold text-gray-500 uppercase hover:text-white">Editar Preço</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminClients: React.FC = () => (
  <div className="py-20 text-center opacity-50">
    <Users size={64} className="mx-auto mb-4" />
    <p className="text-xl font-bold">Gestão de Clientes vindo em breve...</p>
  </div>
);

const ProductShop: React.FC = () => {
  const { products } = useStore();
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <h3 className="text-2xl font-bold">Produtos Selecionados</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-primary rounded-3xl border border-gray-800 overflow-hidden shadow-xl group">
            <div className="h-56 relative overflow-hidden">
              <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <span className="text-xs font-bold text-secondary uppercase tracking-widest">{p.category}</span>
              </div>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-xl mb-2">{p.name}</h4>
              <div className="flex items-center justify-between mt-6">
                <span className="text-2xl font-black text-white">R$ {p.price}</span>
                <button className="bg-secondary px-6 py-2 rounded-xl font-bold hover:shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                  Comprar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FidelityPage: React.FC = () => {
  const { currentUser } = useStore();
  return (
    <div className="max-w-xl mx-auto space-y-8 text-center py-10">
      <div className="bg-gradient-to-br from-yellow-400 to-orange-600 w-24 h-24 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-yellow-500/20">
        <Award size={48} className="text-white" />
      </div>
      <h3 className="text-3xl font-black">Clube do Everton</h3>
      <p className="text-gray-400">Quanto mais você cuida do seu visual, mais você ganha. Complete 10 agendamentos e o próximo é por nossa conta!</p>
      
      <div className="bg-primary p-8 rounded-3xl border border-gray-800 shadow-2xl">
         <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-secondary bg-secondary/10">
                  Progresso
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-secondary">
                  {((currentUser?.fidelityPoints || 0) / 10) * 100}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-800">
              <div style={{ width: `${((currentUser?.fidelityPoints || 0) / 10) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-secondary transition-all duration-1000"></div>
            </div>
            <p className="text-sm font-bold text-white">Faltam {10 - (currentUser?.fidelityPoints || 0)} cortes!</p>
          </div>
      </div>
    </div>
  );
};

const GalleryPage: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[1,2,3,4,5,6,7,8].map(i => (
      <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-gray-800">
        <img src={`https://picsum.photos/seed/barber${i}/500/500`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
      </div>
    ))}
  </div>
);

const App: React.FC = () => (
  <StoreProvider>
    <Router />
  </StoreProvider>
);

export default App;
