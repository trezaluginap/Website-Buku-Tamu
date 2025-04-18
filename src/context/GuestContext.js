// src/context/GuestContext.js
import React, { createContext, useState } from "react";

export const GuestContext = createContext();

export const GuestProvider = ({ children }) => {
  const [guests, setGuests] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);

  const addGuest = (guest) => {
    setGuests([...guests, guest]);
  };

  return (
    <GuestContext.Provider
      value={{ guests, addGuest, selectedGuest, setSelectedGuest }}
    >
      {children}
    </GuestContext.Provider>
  );
};
