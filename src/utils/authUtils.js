import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { Context } from "../front/js/store/appContext";
import AuthRequired from "../front/js/component/AuthRequired";

export const useAuthModal = (onSuccessPath = '') => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { store } = useContext(Context);

  const handleAuthAction = () => {
    if (!store.token) {
      setIsModalOpen(true);
    } else if (onSuccessPath) {
      navigate(onSuccessPath);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return {
    isModalOpen,
    handleAuthAction,
    closeModal
  };
};

export const withAuthProtection = (WrappedComponent) => {
  return function WithAuthProtection(props) {
    const { isModalOpen, closeModal } = useAuthModal('/');
    const { store } = useContext(Context);
    
    if (!store.token) {
      return <AuthRequired onClose={closeModal} />;
    }
    
    return <WrappedComponent {...props} />;
  };
};