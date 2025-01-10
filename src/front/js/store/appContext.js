import React, { useState, useEffect } from "react";
import getState from "./flux.js";

export const Context = React.createContext(null);

const injectContext = PassedComponent => {
  const StoreWrapper = props => {
    const [state, setState] = useState(
      getState({
        getStore: () => state.store,
        getActions: () => state.actions,
        setStore: updatedStore =>
          setState({
            store: Object.assign(state.store, updatedStore),
            actions: { ...state.actions }
          })
      })
    );

    useEffect(() => {
      const initializeApp = async () => {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const tokenVerified = await state.actions.verifyToken();
            if (tokenVerified) {
              await state.actions.checkAdmin();
            }
          }
        } catch (error) {
          console.error("Error en la inicialización de la app:", error);
        }
      };

      initializeApp();

      // Renovar token cada 5 minutos solo si hay un token
      const tokenInterval = setInterval(async () => {
        const token = localStorage.getItem("token");
        if (token) {
          await state.actions.verifyToken();
        }
      }, 300000);

      return () => clearInterval(tokenInterval);
    }, []);

    return (
      <Context.Provider value={state}>
        <PassedComponent {...props} />
      </Context.Provider>
    );
  };
  return StoreWrapper;
};

export default injectContext;