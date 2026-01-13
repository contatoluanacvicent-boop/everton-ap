
import React from 'react';
import { useStore } from '../context/StoreContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Scissors, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { bookings, financials, services } = useStore();

  const totalRevenue = financials
    .filter(f => f.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyData = [
    { name: 'Jan', value: 4000 },
    { name: 'Fev', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Abr', value: 2780 },
    { name: 'Mai', value: totalRevenue || 1890 },
  ];

  const stats = [
    { label: 'Faturamento Mensal', value: `R$ ${totalRevenue.toLocaleString()}`, icon: <DollarSign className="text-green-400" />, trend: '+12%', color: 'bg-green-500/10' },
    { label: 'Agendamentos', value: bookings.length, icon: <Scissors className="text-blue-400" />, trend: '+5%', color: 'bg-blue-500/10' },
    { label: 'Novos Clientes', value: '24', icon: <Users className="text-purple-400" />, trend: '+18%', color: 'bg-purple-500/10' },
    { label: 'Ticket Médio', value: 'R$ 65,00', icon: <TrendingUp className="text-orange-400" />, trend: '-2%', color: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-primary p-6 rounded-2xl border border-gray-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${stat.trend.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-primary p-6 rounded-2xl border border-gray-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Visão Geral de Vendas</h3>
            <select className="bg-gray-800 border-none rounded-lg text-sm px-3 py-1 text-gray-400">
              <option>Últimos 6 meses</option>
              <option>Último ano</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-primary p-6 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
          <h3 className="text-lg font-bold mb-4">Próximos Agendamentos</h3>
          <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
            {bookings.length > 0 ? bookings.slice(0, 6).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors border border-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center font-bold text-secondary">
                    {booking.userName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold truncate max-w-[120px]">{booking.userName}</p>
                    <p className="text-xs text-gray-500">{booking.serviceName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-secondary">{booking.time}</p>
                  <p className="text-[10px] text-gray-500">{new Date(booking.date).toLocaleDateString()}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-gray-500">
                <Scissors className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>Nenhum agendamento hoje</p>
              </div>
            )}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-medium text-secondary hover:underline">
            Ver agenda completa
          </button>
        </div>
      </div>
    </div>
  );
};
