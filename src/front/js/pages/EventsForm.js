import React from "react";
import Form from "../component/form"
import Navbar from "../component/navbar";
import Breadcrumbs from "../component/Breadcrumbs.jsx";;
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

export default EventsForm;