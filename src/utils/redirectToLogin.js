import React from 'react';
import { useAuthModal } from './authUtils'; // Asegúrate de que la ruta sea correcta
import AuthRequired from '../src/front/js/component/AuthRequired';

const RedirectToLogin = () => {
  const { handleAuthAction } = useAuthModal('/login', () => {
    <AuthRequired condition="TokenExpired" />
  });
  handleAuthAction();
  return null; // No renderiza nada
};

export default RedirectToLogin;
