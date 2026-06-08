import React, { useState } from 'react';
import { useReservation } from '../hooks/useReservation';

export const ClientDataStep = () => {
  const { clientData, updateClientData, nextStep, prevStep } = useReservation();

  // Local state for tracking form validation errors
  const [errors, setErrors] = useState({
    name: false,
    phone: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateClientData({ [name]: value });

    // Live validation error clearing
    if (value.trim() !== "") {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    
    const nameEmpty = clientData.name.trim() === "";
    const phoneEmpty = clientData.phone.trim() === "";

    if (nameEmpty || phoneEmpty) {
      setErrors({
        name: nameEmpty,
        phone: phoneEmpty
      });
      return;
    }

    nextStep();
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center animate-slide-in-right">
      <div className="w-full glass-panel rounded-2xl p-6 md:p-8 flex flex-col">
        {/* Title */}
        <h3 className="text-xl md:text-2xl font-outfit font-bold text-white text-center mb-1">
          Tus datos de contacto
        </h3>
        <p className="text-xs text-neutral-400 text-center mb-8">
          Completa tus datos para confirmar tu mesa en Los Compadres.
        </p>

        {/* Contact Form */}
        <form onSubmit={handleNext} className="flex flex-col gap-6 mb-8 text-left">
          {/* Full Name Input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Nombre Completo <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={clientData.name}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez"
              autoComplete="name"
              className={`py-3 px-4 rounded-xl text-sm font-sans glass-input text-white ${
                errors.name ? 'border-red-500/60 focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.15)]' : ''
              }`}
            />
            {errors.name && (
              <span className="text-[10px] text-red-400 font-medium">El nombre es obligatorio.</span>
            )}
          </div>

          {/* Phone Number Input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Número Telefónico / Celular <span className="text-amber-500">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-sm text-neutral-400 font-semibold font-outfit select-none">
                +57
              </span>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={clientData.phone}
                onChange={handleChange}
                placeholder="300 123 4567"
                autoComplete="tel"
                className={`w-full py-3 pl-14 pr-4 rounded-xl text-sm font-sans glass-input text-white ${
                  errors.phone ? 'border-red-500/60 focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.15)]' : ''
                }`}
              />
            </div>
            {errors.phone ? (
              <span className="text-[10px] text-red-400 font-medium">El número telefónico es obligatorio.</span>
            ) : (
              <span className="text-[9px] text-neutral-500">Usaremos este número para coordinar la llegada si es necesario.</span>
            )}
          </div>

          {/* Comments Textarea */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="comments" className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Comentarios Adicionales (Opcional)
            </label>
            <textarea
              id="comments"
              name="comments"
              value={clientData.comments}
              onChange={handleChange}
              rows="3"
              placeholder="Ej. ¿Tienes alguna alergia alimentaria? ¿Es una sorpresa? Cuéntanos..."
              className="py-3 px-4 rounded-xl text-sm font-sans glass-input text-white resize-none"
            />
          </div>
        </form>

        {/* Navigation Buttons */}
        <div className="flex gap-4 w-full mt-auto">
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 py-3.5 rounded-xl text-sm font-outfit uppercase tracking-wider border border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all cursor-pointer"
          >
            Atrás
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex-2 py-3.5 rounded-xl text-sm font-outfit uppercase tracking-wider gold-gradient-button cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDataStep;
