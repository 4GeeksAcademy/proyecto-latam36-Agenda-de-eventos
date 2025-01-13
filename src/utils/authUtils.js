import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from "../front/js/store/appContext";
import AuthRequired from "../front/js/component/AuthRequired";

export const useAuthModal = (onSuccessPath = '', onCloseAction = null) => {
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
    if (onCloseAction) {
      onCloseAction();
    }
  };

  return {
    isModalOpen,
    handleAuthAction,
    closeModal
  };
};
