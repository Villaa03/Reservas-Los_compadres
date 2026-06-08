import React, { createContext, useState, useEffect } from 'react';
import { getAvailableDates } from '../utils/dateHelpers';
import { fetchFechasBloqueadas } from '../services/reservasService';

export const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const [step, setStep] = useState(1);
  const [blockedDates, setBlockedDates] = useState([]);

  const availableDatesList = getAvailableDates(30).filter(
    (d) => !blockedDates.includes(d.isoString)
  );
  const firstAvailableDate = availableDatesList.length > 0 ? availableDatesList[0].isoString : '';

  const [persons, setPersons] = useState(2);
  const [occasion, setOccasion] = useState('');
  const [decoracionCumpleanos, setDecoracionCumpleanos] = useState(false);
  const [date, setDate] = useState(firstAvailableDate);
  const [time, setTime] = useState('');
  const [preOrder, setPreOrder] = useState([]);
  const [clientData, setClientData] = useState({
    name: '',
    phone: '',
    comments: '',
  });

  useEffect(() => {
    fetchFechasBloqueadas().then((fechas) => {
      setBlockedDates(fechas.map((f) => f.fecha));
    });
  }, []);

  useEffect(() => {
    if (date && blockedDates.includes(date)) {
      setDate(firstAvailableDate);
    }
  }, [blockedDates, date, firstAvailableDate]);

  useEffect(() => {
    setTime('');
  }, [date]);

  useEffect(() => {
    if (occasion !== 'Cumpleaños') {
      setDecoracionCumpleanos(false);
    }
  }, [occasion]);

  const getPreOrderItemsCount = () => {
    return preOrder.reduce((acc, item) => acc + item.quantity, 0);
  };

  const nextStep = () => {
    if (step < 8 && isStepValid(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const goToStep = (stepNum) => {
    if (stepNum >= 1 && stepNum <= 8) {
      let canJump = true;
      for (let i = 1; i < stepNum; i++) {
        if (!isStepValid(i)) {
          canJump = false;
          break;
        }
      }
      if (canJump) {
        setStep(stepNum);
      }
    }
  };

  const setPersonsCount = (count) => {
    if (count > 0) setPersons(count);
  };

  const setOccasionSelected = (occ) => {
    setOccasion(occ);
  };

  const setDateSelected = (isoString) => {
    setDate(isoString);
  };

  const setTimeSelected = (timeStr) => {
    setTime(timeStr);
  };

  const addToPreOrder = (item) => {
    setPreOrder((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const removeFromPreOrder = (itemId) => {
    setPreOrder((prev) => prev.filter((p) => p.id !== itemId));
  };

  const updatePreOrderQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromPreOrder(itemId);
    } else {
      setPreOrder((prev) =>
        prev.map((p) => (p.id === itemId ? { ...p, quantity } : p))
      );
    }
  };

  const clearPreOrder = () => {
    setPreOrder([]);
  };

  const updateClientData = (fields) => {
    setClientData((prev) => ({ ...prev, ...fields }));
  };

  const resetReservation = () => {
    setStep(1);
    setPersons(2);
    setOccasion('');
    setDecoracionCumpleanos(false);
    setDate(firstAvailableDate);
    setTime('');
    setPreOrder([]);
    setClientData({ name: '', phone: '', comments: '' });
  };

  const isStepValid = (stepNum) => {
    switch (stepNum) {
      case 1:
        return true;
      case 2:
        return persons > 0;
      case 3:
        return occasion !== '';
      case 4:
        return date !== '' && !blockedDates.includes(date);
      case 5:
        return time !== '';
      case 6:
        if (persons >= 6) {
          return getPreOrderItemsCount() >= persons;
        }
        return true;
      case 7:
        return clientData.name.trim() !== '' && clientData.phone.trim() !== '';
      case 8:
        return true;
      default:
        return false;
    }
  };

  const getPreOrderTotal = () => {
    return preOrder.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <ReservationContext.Provider
      value={{
        step,
        persons,
        occasion,
        decoracionCumpleanos,
        date,
        time,
        preOrder,
        clientData,
        blockedDates,
        nextStep,
        prevStep,
        goToStep,
        setPersonsCount,
        setOccasionSelected,
        setDecoracionCumpleanos,
        setDateSelected,
        setTimeSelected,
        addToPreOrder,
        removeFromPreOrder,
        updatePreOrderQuantity,
        clearPreOrder,
        updateClientData,
        resetReservation,
        isStepValid,
        getPreOrderTotal,
        getPreOrderItemsCount,
        availableDatesList,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};
