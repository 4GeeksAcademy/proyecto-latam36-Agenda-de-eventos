import React from "react";
import "../../styles/eventForm.css";

function Form() {
  return (
    <>
    <div id="home-form-container">
      <h1>Formulario para eventos</h1>
      <form>
        <p>
          Nombre del evento <span>*</span>
        </p>
        <input type="text" placeholder="Nombre" required />
        <p>
          Descripción del evento <span>*</span>
        </p>
        <textarea
          name="descripcion"
          placeholder="Descripción del evento"
        ></textarea>
        <p>
          Fecha del evento <span>*</span>
        </p>
        <input type="date" required />
        <p>
          Categoria del evento <span>*</span>
        </p>
        <select name="categoria" required>
          <option selected disabled value="">
            --Seleccione--
          </option>
          <option value="concierto">Concierto</option>
          <option value="teatro">Teatro</option>
          <option value="museo">Museo</option>
          <option value="infantil">Infantil</option>
          <option value="vida nocturna">Vida nocturna</option>
        </select>
        <input type="text" placeholder="Direccion" required />
        <p>Enlace de google maps</p>
        <input type="url" name="googlemaps" />
        <p>Facebook</p>
        <input type="text" placeholder="Facebook" />
        <p>Twitter</p>
        <input type="text" placeholder="Twitter" />
        <p>Instagram</p>
        <input type="text" placeholder="Instagram" />
        <p>
          Imagen del evento <span>*</span>
        </p>
        <input type="file" name="imagen" required multiple />
        <input type="submit" value="Enviar" />
      </form>
    </div>
    </>
  );
}

export default Form;
