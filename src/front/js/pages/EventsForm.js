import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../component/form";
import Navbar from "../component/navbar";
import Breadcrumbs from "../component/Breadcrumbs.jsx";
import { withAuthProtection } from '../../../utils/authUtils';
import "../../styles/eventForm.css";

function EventsForm() {

  return (
    <>
      <Navbar />
      <Breadcrumbs />
        <Form />
    </>
  );
}

export default withAuthProtection(EventsForm);;
  