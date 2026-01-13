
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Calendar as CalendarIcon, Clock, CreditCard, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, ShieldCheck, Info } from 'lucide-react';

export const BookingPage: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { services, currentUser, addBooking, settings } = useStore();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [paymentOption, setPaymentOption] = useState<'partial' | 'full'>('full');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const service = services.find(s => s.id === selectedService);
  const totalPrice = service?.price || 0;
  const partialPrice = totalPrice * (settings.advancePaymentMinPercent / 100);

  const handleFinish = async () => {
    if (!service || !currentUser) return;
    setLoading(true);
    
    // Simulate secure processing
    setTimeout(() => {
      const amountPaid = paymentOption === 'full' ? totalPrice : partialPrice;
      const amountRemaining = totalPrice - amountPaid;

      addBooking({
        userId: currentUser.id,
        userName: currentUser.name,
        serviceId: service.id,
        serviceName: service.name,
        date: selectedDate,
        time: selectedTime,
        status: 'pending',
        paymentStatus: paymentOption === 'full' ? 'full' : 'partial',
        totalPrice: totalPrice,
        amountPaid: amountPaid,
        amountRemaining: amountRemaining
      });
      setLoading(false);
      setSuccess(true);
      setTimeout(onComplete, 2000);
    }, 1500);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/30">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Agendamento Realizado!</h2>
        <p className="text-gray-400 text-center max-w-sm">Sua vaga está garantida. O comprovante foi enviado para seu e-mail.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-24">
      {/* Progress */}
      <div className="flex items-center justify-between px-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2 relative flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 transition-colors ${
              step >= i ? 'bg-secondary text-white' : 'bg-gray-800 text-gray-500'
            }`}>
              {i}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= i ? 'text-secondary' : 'text-gray-500'}`}>
              {i === 1 ? 'Serviço' : i === 2 ? 'Data/Hora' : i === 3 ? 'Pagamento' : 'Confirmação'}
            </span>
            {i < 4 && <div className={`absolute top-5 left-1/2 w-full h-[2px] -z-0 ${step > i ? 'bg-secondary' : 'bg-gray-800'}`}></div>}
          </div>
        ))}
      </div>

      <div className="bg-primary p-8 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-secondary">Processando Pagamento Seguro...</p>
          </div>
        )}

        {step === 1 && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-bold mb-6">Escolha o Serviço</h3>
            <div className="grid grid-cols-1 gap-4">
              {services.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedService(s.id); setStep(2); }}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all text-left ${
                    selectedService === s.id ? 'border-secondary bg-secondary/10' : 'border-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img src={s.image} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-lg">{s.name}</h4>
                      <p className="text-sm text-gray-400">{s.duration} min • {s.category}</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-secondary">R$ {s.price}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-bold mb-6">Data e Horário</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Selecione o Dia</label>
                <input 
                  type="date" 
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-secondary"
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Horários Disponíveis</label>
                <div className="grid grid-cols-3 gap-3">
                  {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`py-3 rounded-xl border font-bold transition-all ${
                        selectedTime === t ? 'bg-secondary border-secondary text-white' : 'border-gray-800 hover:border-gray-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 py-4 bg-gray-800 rounded-xl font-bold">Voltar</button>
              <button 
                onClick={() => setStep(3)} 
                disabled={!selectedDate || !selectedTime}
                className="flex-[2] py-4 bg-secondary rounded-xl font-bold disabled:opacity-50"
              >
                Próximo Passo
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="text-green-500 w-8 h-8" />
              <h3 className="text-2xl font-bold">Pagamento Seguro</h3>
            </div>
            
            <p className="text-gray-400 mb-6 text-sm">Para garantir sua reserva e evitar faltas, solicitamos um pagamento antecipado.</p>

            <div className="space-y-4">
              <button 
                onClick={() => setPaymentOption('full')}
                className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all text-left ${
                  paymentOption === 'full' ? 'border-secondary bg-secondary/10' : 'border-gray-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/20 rounded-xl"><CreditCard className="text-secondary" /></div>
                  <div>
                    <h4 className="font-bold">Total Antecipado (100%)</h4>
                    <p className="text-xs text-gray-400">Pague tudo agora e agilize seu check-out.</p>
                  </div>
                </div>
                <span className="font-bold text-xl">R$ {totalPrice}</span>
              </button>

              <button 
                onClick={() => setPaymentOption('partial')}
                className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all text-left ${
                  paymentOption === 'partial' ? 'border-secondary bg-secondary/10' : 'border-gray-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl"><Info className="text-blue-500" /></div>
                  <div>
                    <h4 className="font-bold">Mínimo para Reserva ({settings.advancePaymentMinPercent}%)</h4>
                    <p className="text-xs text-gray-400">Pague o restante no dia do serviço.</p>
                  </div>
                </div>
                <span className="font-bold text-xl">R$ {partialPrice}</span>
              </button>
              
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 mt-6">
                <AlertCircle className="text-red-500 shrink-0 w-5 h-5" />
                <div className="text-xs text-red-200">
                  <p className="font-bold mb-1 uppercase tracking-wider">Política de Cancelamento:</p>
                  Cancelamentos com menos de <span className="font-black underline">{settings.cancellationNoticeHours} hora(s)</span> ou não comparecimento resultam na cobrança automática de <span className="font-black underline">{settings.cancellationFeePercent}% do valor total</span> do serviço.
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex gap-4">
              <button onClick={() => setStep(2)} className="flex-1 py-4 bg-gray-800 rounded-xl font-bold">Voltar</button>
              <button onClick={() => setStep(4)} className="flex-[2] py-4 bg-secondary rounded-xl font-bold">Revisar Reserva</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-bold mb-6">Confirmar Detalhes</h3>
            <div className="bg-gray-900 rounded-3xl p-6 space-y-4 border border-gray-800">
              <div className="flex justify-between border-b border-gray-800 pb-3">
                <span className="text-gray-400">Serviço Escolhido</span>
                <span className="font-bold text-secondary">{service?.name}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-3">
                <span className="text-gray-400">Data e Horário</span>
                <span className="font-bold">{selectedDate} às {selectedTime}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-3">
                <span className="text-gray-400">Valor Total</span>
                <span className="font-bold">R$ {totalPrice}</span>
              </div>
              <div className="flex justify-between pt-4">
                <div className="flex flex-col">
                   <span className="text-sm font-bold text-gray-400">PAGAR AGORA</span>
                   <span className="text-xs text-gray-500 italic">Cartão de Crédito ou PIX</span>
                </div>
                <span className="text-3xl font-black text-white">
                  R$ {paymentOption === 'full' ? totalPrice : partialPrice}
                </span>
              </div>
              {paymentOption === 'partial' && (
                <div className="text-right text-xs text-orange-400 font-bold">
                  Restante de R$ {totalPrice - partialPrice} a pagar no local.
                </div>
              )}
            </div>
            <div className="mt-8 flex gap-4">
              <button onClick={() => setStep(3)} className="flex-1 py-4 bg-gray-800 rounded-xl font-bold">Voltar</button>
              <button 
                onClick={handleFinish} 
                className="flex-[2] py-4 bg-secondary rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                disabled={loading}
              >
                Pagar e Agendar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
