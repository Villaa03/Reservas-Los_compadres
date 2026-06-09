import { useState } from 'react';
import { useReservation } from '../hooks/useReservation';
import { MENU_CATEGORIES, MENU_ITEMS } from '../constants/menu';

export const PreOrderStep = () => {
  const {
    persons,
    preOrder,
    addToPreOrder,
    updatePreOrderQuantity,
    getPreOrderTotal,
    getPreOrderItemsCount,
    clearPreOrder,
    nextStep,
    prevStep,
  } = useReservation();

  const [activeCategory, setActiveCategory] = useState('entradas');

  const isObligatorio = persons >= 6;
  const totalItemsCount = getPreOrderItemsCount();
  const platosFaltantes = isObligatorio ? Math.max(0, persons - totalItemsCount) : 0;
  const canProceed = !isObligatorio || totalItemsCount >= persons;

  const filteredItems = MENU_ITEMS.filter((item) => item.category === activeCategory);

  const getItemQuantity = (itemId) => {
    const item = preOrder.find((p) => p.id === itemId);
    return item ? item.quantity : 0;
  };

  const handleAdd = (item) => {
    addToPreOrder(item);
  };

  const handleDecrease = (itemId) => {
    const currentQty = getItemQuantity(itemId);
    if (currentQty > 0) {
      updatePreOrderQuantity(itemId, currentQty - 1);
    }
  };

  const handleIncrease = (itemId) => {
    const currentQty = getItemQuantity(itemId);
    updatePreOrderQuantity(itemId, currentQty + 1);
  };

  const totalAmount = getPreOrderTotal();

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 flex flex-col items-center animate-slide-in-right">
      <div className="w-full glass-panel rounded-2xl p-5 md:p-7 flex flex-col">
        <h3 className="text-xl md:text-2xl font-outfit font-bold text-white text-center mb-1">
          Pedido Anticipado {isObligatorio ? '(Obligatorio)' : '(Opcional)'}
        </h3>
        <p className="text-xs text-neutral-400 text-center mb-4">
          {isObligatorio
            ? `Selecciona un plato por cada persona (${persons} platos requeridos).`
            : 'Agrega platos o cócteles y ahorra tiempo al llegar al Rooftop.'}
        </p>

        {isObligatorio && (
          <div
            className={`mb-4 p-3 rounded-xl border text-center ${
              canProceed
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : 'bg-amber-950/25 border-amber-500/30'
            }`}
          >
            <p className={`text-xs font-medium ${canProceed ? 'text-emerald-300' : 'text-amber-200'}`}>
              {canProceed
                ? `✓ ${totalItemsCount} de ${persons} platos seleccionados`
                : `⚠ Faltan ${platosFaltantes} plato${platosFaltantes !== 1 ? 's' : ''} por seleccionar (${totalItemsCount}/${persons})`}
            </p>
          </div>
        )}

        <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar mb-6 gap-2">
          {MENU_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`py-2.5 px-4 font-outfit text-sm font-semibold tracking-wide border-b-2 whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'border-gold-400 text-gold-300 bg-gold-950/10'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="max-h-[300px] overflow-y-auto pr-1 no-scrollbar mb-6 flex flex-col gap-4">
          {filteredItems.map((item) => {
            const qty = getItemQuantity(item.id);
            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border flex gap-3.5 transition-all duration-300 ${
                  qty > 0
                    ? 'bg-gold-950/20 border-gold-500/40 shadow-[0_4px_12px_rgba(0,0,0,0.2)]'
                    : 'bg-neutral-900/40 border-white/5 hover:border-white/10'
                }`}
              >
                {qty > 0 && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-500 text-neutral-950 text-sm font-bold flex items-center justify-center font-outfit shadow-md mt-1">
                    {qty}
                  </div>
                )}

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h4 className="text-sm font-bold text-white truncate font-outfit">{item.name}</h4>
                    {item.description && (
                      <p className="text-[10px] text-neutral-400 mt-0.5 font-sans leading-tight">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs md:text-sm font-extrabold text-gold-400 font-outfit">
                      ${item.price.toLocaleString('es-CO')}{' '}
                      <span className="text-[9px] font-medium text-neutral-400">COP</span>
                    </span>

                    {qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => handleAdd(item)}
                        className="py-1 px-3 rounded-lg text-[10px] font-bold font-outfit uppercase tracking-wider bg-neutral-800 border border-neutral-700 text-neutral-300 hover:border-gold-500 hover:text-gold-400 transition-all cursor-pointer"
                      >
                        Agregar ＋
                      </button>
                    ) : (
                      <div className="flex items-center bg-neutral-950 border border-white/5 rounded-lg overflow-hidden h-7">
                        <button
                          type="button"
                          onClick={() => handleDecrease(item.id)}
                          className="px-2.5 h-full text-xs font-bold text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all cursor-pointer"
                        >
                          －
                        </button>
                        <span className="px-2.5 text-xs font-extrabold font-outfit text-white min-w-6 text-center select-none">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleIncrease(item.id)}
                          className="px-2.5 h-full text-xs font-bold text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all cursor-pointer"
                        >
                          ＋
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {totalItemsCount > 0 && (
          <div className="mb-6 p-3 bg-gold-950/20 border border-gold-500/20 rounded-xl flex items-center justify-between animate-fade-in">
            <div className="text-left">
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-medium">
                Resumen del Pedido
              </span>
              <span className="text-xs font-bold text-neutral-200 block mt-0.5">
                {totalItemsCount} {totalItemsCount === 1 ? 'plato' : 'platos'} seleccionados
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-sm font-extrabold text-gold-300 font-outfit">
                  ${totalAmount.toLocaleString('es-CO')} COP
                </span>
              </div>
              <button
                type="button"
                onClick={clearPreOrder}
                className="text-[10px] text-red-400 hover:text-red-300 underline font-semibold cursor-pointer"
              >
                Limpiar
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-4 w-full mt-auto">
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 py-3.5 rounded-xl text-sm font-outfit uppercase tracking-wider border border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all cursor-pointer"
          >
            Atrás
          </button>
          {isObligatorio ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canProceed}
              className="flex-2 py-3.5 rounded-xl text-sm font-outfit uppercase tracking-wider gold-gradient-button disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="flex-2 py-3.5 rounded-xl text-sm font-outfit uppercase tracking-wider gold-gradient-button cursor-pointer"
            >
              {totalItemsCount > 0 ? 'Confirmar Pedido' : 'Omitir Paso'}
            </button>
          )}
        </div>

        {isObligatorio && !canProceed && (
          <p className="text-[10px] text-neutral-500 text-center mt-3">
            Es obligatorio seleccionar un plato por cada persona en grupos de 6 o más.
          </p>
        )}
      </div>
    </div>
  );
};

export default PreOrderStep;
