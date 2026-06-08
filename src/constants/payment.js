export const PAYMENT_INFO = {
  garantiaMesa: 10000,
  decoracionCumpleanos: 25000,
  nequi: '3226615743',
  daviplata: '3226615743',
  bancolombia: 'Cuenta de ahorros — solicitar al restaurante',
};

export const getTotalGarantia = (decoracionCumpleanos) => {
  return PAYMENT_INFO.garantiaMesa + (decoracionCumpleanos ? PAYMENT_INFO.decoracionCumpleanos : 0);
};
