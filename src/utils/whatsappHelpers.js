import { RESTAURANT_SETTINGS } from '../constants/settings';
import { formatIsoToSpanish } from './dateHelpers';
import { formatTime12h } from './timeHelpers';
import { PAYMENT_INFO } from '../constants/payment';

const EMOJI_PEOPLE = '\u{1F465}';
const EMOJI_PARTY = '\u{1F389}';
const EMOJI_CALENDAR = '\u{1F4C5}';
const EMOJI_CLOCK = '\u{1F552}';
const EMOJI_CAKE = '\u{1F370}';
const EMOJI_PERSON = '\u{1F64D}';
const EMOJI_PHONE = '\u{1F4F1}';
const EMOJI_NOTE = '\u{1F4DD}';
const EMOJI_MONEY = '\u{1F4B0}';
const BULLET = '\u{2022}';

const formatPreOrderForWhatsApp = (preOrder) => {
  if (!preOrder || preOrder.length === 0) {
    return 'Ninguno';
  }

  const itemsString = preOrder
    .map(
      (item) =>
        `${BULLET} ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString('es-CO')} COP)`
    )
    .join('\n');

  const total = preOrder.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return `\n${itemsString}\n${EMOJI_MONEY} Total estimado del pedido: $${total.toLocaleString('es-CO')} COP`;
};

export const generateWhatsAppLink = (reservationData) => {
  const {
    persons,
    occasion,
    decoracionCumpleanos,
    date,
    time,
    preOrder,
    clientData,
    totalGarantia,
  } = reservationData;
  const { name, phone, comments } = clientData;

  const formattedDate = formatIsoToSpanish(date);
  const formattedTime = formatTime12h(time);
  const formattedPreOrder = formatPreOrderForWhatsApp(preOrder);
  const formattedComments =
    comments && comments.trim() !== '' ? comments.trim() : 'Sin comentarios adicionales';

  const decoracionLine = decoracionCumpleanos
    ? `\n${EMOJI_PARTY} Decoración especial de cumpleaños: Sí (+$${PAYMENT_INFO.decoracionCumpleanos.toLocaleString('es-CO')} COP)`
    : '';

  const garantiaLine = totalGarantia
    ? `\n${EMOJI_MONEY} Total garantía transferida: $${totalGarantia.toLocaleString('es-CO')} COP`
    : '';

  const message = `Hola Los Compadres Rooftop.

Quiero realizar una reserva:

${EMOJI_PEOPLE} Personas: ${persons}

${EMOJI_PARTY} Ocasión: ${occasion}${decoracionLine}

${EMOJI_CALENDAR} Fecha: ${formattedDate}

${EMOJI_CLOCK} Hora: ${formattedTime}

${EMOJI_CAKE} Pedido anticipado: ${formattedPreOrder}

${EMOJI_PERSON} Nombre: ${name}

${EMOJI_PHONE} Teléfono: ${phone}

${EMOJI_NOTE} Comentarios: ${formattedComments}${garantiaLine}

Adjunto comprobante de transferencia.

Gracias.`;

  const encodedText = encodeURIComponent(message);

  return `https://api.whatsapp.com/send?phone=${RESTAURANT_SETTINGS.whatsappNumber}&text=${encodedText}`;
};
