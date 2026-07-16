export const RESTAURANT_SETTINGS = {
  name: "Los Compadres Rooftop",
  location: "Facatativá, Colombia",
  whatsappNumber: "573145388170", // Formato sin espacios ni símbolos
  whatsappUrlBase: "https://wa.me",
  kitchenCloseTime: "20:30",
  schedules: {
    tuesday: { closed: true },
    monday: { open: "12:00", close: "22:00" },
    wednesday: { open: "12:00", close: "22:00" },
    thursday: { open: "12:00", close: "22:00" },
    sunday: { open: "12:00", close: "22:00" },
    friday: { open: "12:00", close: "23:00" },
    saturday: { open: "12:00", close: "23:00" }
  }
};
