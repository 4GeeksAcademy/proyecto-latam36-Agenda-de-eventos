import React from "react";
import { useNavigate } from "react-router-dom";
import Form from "../component/form";
import Navbar from "../component/navbar";
import Breadcrumbs from "../component/Breadcrumbs.jsx";
import { useAuthModal } from '../../../utils/authUtils';
import AuthRequired from "../component/AuthRequired";
import "../../styles/eventForm.css";

const authTitleProps = { page: 'EventsForm' };

function EventsForm() {
  const { isModalOpen, handleAuthAction, closeModal } = useAuthModal('/EventsForm', handleCloseAction);
  const navigate = useNavigate();

  const handleCloseAction = () => {
    alert('Debes Iniciar Sesión para crear un evento. Serás redirigido al inicio.');
    navigate('/');
  };

  React.useEffect(() => {
    handleAuthAction();
  }, []);

  return (
    <>
      <Navbar />
      <Breadcrumbs />
      <Form />
      {isModalOpen && <AuthRequired onClose={() => { closeModal(); handleCloseAction(); }} authTitleProps={authTitleProps} />}
    </>
  );
}

export default EventsForm;
