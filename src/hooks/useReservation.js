import { useContext } from 'react';
import { ReservationContext } from '../context/ReservationContext';

/**
 * Custom hook to easily access the ReservationContext throughout the application.
 * @returns {Object} Context value including reservation state and functions
 */
export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error("useReservation must be used within a ReservationProvider");
  }
  return context;
};
