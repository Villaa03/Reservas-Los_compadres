import { useState } from 'react';
import { useReservation } from '../hooks/useReservation';
import { formatIsoToSpanish } from '../utils/dateHelpers';
import { formatTime12h } from '../utils/timeHelpers';
import { generateWhatsAppLink } from '../utils/whatsappHelpers';
import { PAYMENT_INFO, getTotalGarantia } from '../constants/payment';
import { saveReserva } from '../services/reservasService';

export const SummaryStep = () => {
  const {
    persons,
    occasion,
    decoracionCumpleanos,
    date,
    time,
    preOrder,
    clientData,
    getPreOrderTotal,
    prevStep,
    resetReservation,
  } = useReservation();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const totalGarantia = getTotalGarantia(decoracionCumpleanos);
  const totalPreOrderAmount = getPreOrderTotal();
  const preOrderItemsCount = preOrder.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleSendWhatsApp = async () => {
    setSaving(true);

    const reservaData = {
      personas: persons,
      ocasion: occasion,
      decoracion_cumpleanos: decoracionCumpleanos,
      fecha: date,
      hora: time,
      pedido_anticipado: preOrder,
      cliente_nombre: clientData.name,
      cliente_telefono: clientData.phone,
      cliente_comentarios: clientData.comments,
      valor_garantia: totalGarantia,
      estado: 'pendiente',
    };

    const result = await saveReserva(reservaData);
    setSaving(false);

    if (!result.success) {
      return;
    }

    setSaved(true);

    const waLink = generateWhatsAppLink({
      persons,
      occasion,
      decoracionCumpleanos,
      date,
      time,
      preOrder,
      clientData,
      totalGarantia,
    });

    window.open(waLink, '_blank');
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center animate-slide-in-right">
      <div className="w-full glass-panel-gold rounded-2xl p-6 md:p-8 flex flex-col">
        <span className="text-3xl text-center mb-1">🥂</span>
        <h3 className="text-xl md:text-2xl font-outfit font-bold text-white text-center mb-1">
          ¡Reserva casi lista!
        </h3>
        <p className="text-xs text-neutral-400 text-center mb-6 font-sans">
          Revisa el resumen y realiza la transferencia antes de enviar por WhatsApp.
        </p>

        {/* Payment breakdown */}
        <div className="w-full bg-neutral-950/60 border border-gold-500/20 rounded-2xl p-5 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-4 text-center">
            💳 Pago de Garantía
          </h4>
          <div className="flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between text-neutral-300">
              <span>Abono Garantía de Mesa</span>
              <span className="font-bold font-outfit">
                ${PAYMENT_INFO.garantiaMesa.toLocaleString('es-CO')} COP
              </span>
            </div>
            {decoracionCumpleanos && (
              <div className="flex justify-between text-neutral-300">
                <span>Decoración Especial (Cumpleaños)</span>
                <span className="font-bold font-outfit text-gold-400">
                  ${PAYMENT_INFO.decoracionCumpleanos.toLocaleString('es-CO')} COP
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-white/10 pt-2.5 mt-1">
              <span className="font-bold text-white">Total a transferir ahora</span>
              <span className="font-extrabold text-gold-300 font-outfit text-base">
                ${totalGarantia.toLocaleString('es-CO')} COP
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2">
            <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
              Datos para transferencia
            </p>
            <div className="text-xs text-neutral-300 space-y-1">
              <p>
                <span className="text-gold-400 font-semibold">Nequi:</span> {PAYMENT_INFO.nequi}
              </p>
              <p>
                <span className="text-gold-400 font-semibold">Daviplata:</span> {PAYMENT_INFO.daviplata}
              </p>
              <p>
                <span className="text-gold-400 font-semibold">Bancolombia:</span> {PAYMENT_INFO.bancolombia}
              </p>
            </div>
            <p className="text-[10px] text-neutral-500 mt-2 leading-relaxed">
              Realiza la transferencia y adjunta el comprobante en el mensaje de WhatsApp para confirmar tu reserva.
            </p>
          </div>
        </div>

        {/* Summary Sheet */}
        <div className="w-full bg-neutral-950/60 border border-white/5 rounded-2xl p-5 mb-8 flex flex-col gap-4 text-left">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
            <div className="flex items-start gap-2.5">
              <span className="text-lg">👥</span>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Personas</span>
                <span className="text-sm font-bold text-white font-outfit">
                  {persons} {persons === 1 ? 'persona' : 'personas'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="text-lg">🎉</span>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Ocasión</span>
                <span className="text-sm font-bold text-white font-outfit">{occasion || 'Cena'}</span>
                {decoracionCumpleanos && (
                  <span className="text-[10px] text-gold-400 block mt-0.5">+ Decoración especial</span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="text-lg">📅</span>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Fecha</span>
                <span className="text-sm font-bold text-white font-outfit truncate">
                  {formatIsoToSpanish(date)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="text-lg">🕒</span>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Hora</span>
                <span className="text-sm font-bold text-white font-outfit">{formatTime12h(time)}</span>
              </div>
            </div>
          </div>

          <div className="pb-4 border-b border-white/5">
            <div className="flex items-start gap-2.5">
              <span className="text-lg">🍰</span>
              <div className="flex-1">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Pedido Anticipado
                </span>
                {preOrderItemsCount > 0 ? (
                  <div className="mt-2 flex flex-col gap-1.5">
                    {preOrder.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs">
                        <span className="text-neutral-300 font-medium">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-gold-400 font-bold font-outfit">
                          ${(item.price * item.quantity).toLocaleString('es-CO')} COP
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-1">
                      <span className="text-xs text-neutral-400 font-semibold uppercase">Total Estimado</span>
                      <span className="text-sm font-extrabold text-gold-300 font-outfit">
                        ${totalPreOrderAmount.toLocaleString('es-CO')} COP
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-neutral-400 italic block mt-0.5">Ninguno</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <span className="text-lg">🙍</span>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Nombre</span>
                <span className="text-sm font-bold text-white font-outfit">{clientData.name}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="text-lg">📱</span>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Teléfono</span>
                <span className="text-sm font-bold text-white font-outfit">+57 {clientData.phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="text-lg">📝</span>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Comentarios</span>
                <span className="text-xs text-neutral-300 font-sans mt-0.5 block break-words">
                  {clientData.comments.trim() !== '' ? clientData.comments : 'Sin comentarios adicionales'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 w-full">
          <button
            type="button"
            onClick={handleSendWhatsApp}
            disabled={saving}
            className="w-full py-4 rounded-xl text-base font-outfit uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:scale-101 active:scale-99 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
          >
            <span className="text-xl">💬</span>
            <span>{saving ? 'Guardando...' : saved ? 'Reenviar por WhatsApp' : 'Transferir y Enviar por WhatsApp'}</span>
          </button>

          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 py-3.5 rounded-xl text-xs font-outfit uppercase tracking-wider border border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all cursor-pointer"
            >
              Corregir Datos
            </button>
            <button
              type="button"
              onClick={resetReservation}
              className="flex-1 py-3.5 rounded-xl text-xs font-outfit uppercase tracking-wider bg-neutral-900 hover:bg-neutral-800 text-neutral-300 transition-all cursor-pointer"
            >
              Nueva Reserva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStep;
