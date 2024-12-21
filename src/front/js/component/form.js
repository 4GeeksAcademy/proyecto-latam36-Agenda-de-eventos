import React from "react";

function Form() {
  return (
    <>
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
        <input type="text" placeholder="direccion" required />
        <p>Enlace de google maps</p>
        <input type="url" name="googlemaps" />
        <p>Facebook</p>
        <input type="text" placeholder="facebook" />
        <p>Twitter</p>
        <input type="text" placeholder="twitter" />
        <p>Instagram</p>
        <input type="text" placeholder="instagram" />
        <p>
          Imagen del evento <span>*</span>
        </p>
        <input type="file" name="imagen" required multiple />
        <input type="submit" value="Enviar" />
      </form>
    </>
  );
}

export default Form;
