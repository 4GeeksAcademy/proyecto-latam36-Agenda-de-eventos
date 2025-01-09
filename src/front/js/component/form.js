import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../../styles/eventForm.css";

const Form = () => {
 const [formData, setFormData] = useState({
  eventName: '',
  eventDescription: '',
  eventDateTime: '',
  eventCategory: '',
  audienceCategory: '',
  eventAddress: '',
  googleMapsLink: '',
  socialMediaLinks: {
   instagram: '',
   facebook: ''
  },
  flyerImage: null,
  additionalImages: [],
  isOnlineEvent: false,
  country: 'Colombia',
  instagramEventName: '', 
  facebookEventName: '',  
  isFree: false,
  priceUSD: '', 
 });

 const handleChange = (e) => {
 const { name, value, type, checked } = e.target;

 if (name.startsWith('socialMedia.')) {
   setFormData((prevState) => ({
     ...prevState,
     socialMediaLinks:{
       ...prevState.socialMediaLinks,
       [name.split('.')[1]] : value,
     },
   }));
   return;
 }

 if (type === 'checkbox') {
  setFormData((prevState) => ({
    ...prevState,
    [name]: checked,
  }));
  return;
}

setFormData((prevState) => ({
  ...prevState,
  [name]: value,
}));
};

 const handleFileChange = (e) => {
 const { name } = e.target;

 if (name === 'flyerImage') {
   setFormData((prevState) => ({
     ...prevState,
     flyerImage : e.target.files[0]
   }));
 }

 if (name === 'additionalImages') {
    setFormData((prevState) => ({
      ...prevState,
      additionalImages : [...e.target.files]
    }));
 }
 };

 const handleSubmit = (e) => {
 e.preventDefault();
 console.log('Formulario enviado con los siguientes datos:', formData);
 };

 return (
<div className='form-page'>
<form className="form-container" onSubmit={handleSubmit}>
<div className="form-header">
     <Link to="/">
      <img
          className="logo"
          src="https://res.cloudinary.com/dj6gqmozm/image/upload/f_auto,q_auto/nqyo2gpte9c8kwsgqlbn"
          alt="logo-culturalWave"
           
      />
      </Link>
</div>

<div>
       <p className="form-title">Formulario para Solicitar Evento</p>
     </div>

     <div className="form-group">
        <label>Nombre del Evento:</label>
        <input
          type="text"
          name="eventName"
          value={formData.eventName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Descripción del Evento:</label>
        <textarea
          name="eventDescription"
          placeholder="Máximo de 350 caracteres"
          maxLength="350"
          value={formData.eventDescription}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Fecha y Hora del Evento:</label>
        <input
          type="datetime-local"
          name="eventDateTime"
          value={formData.eventDateTime}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Categoría del Evento:</label>
          <select
            name="eventCategory"
            value={formData.eventCategory}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Selecciona una categoría del Evento
            </option>
            {[
              'Música',
              'Teatro y Danza',
              'Cine',
              'Arte y Exposiciones',
              'Literarios',
              'Conferencias',
              'Talleres y Seminarios',
              'Educación y Aprendizaje',
              'Negocios y Emprendimiento',
              'Deportes',
              'Fitness y Salud',
              'Deportes extremos',
              'Artes Marciales',
              'Familiares',
              'Caridad y Voluntariado',
              'Religión y Espiritualidad',
              'Tecnología',
              'Ciencia',
              'Gastronomía',
              'Bebidas',
              'Moda',
              'Estilo de Vida',
              'Festivales y Carnavales',
              'Celebraciones',
            ].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Categoría de Público Objetivo:</label>
          <select
            name="audienceCategory"
            value={formData.audienceCategory}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Selecciona una categoría de Audiencia
            </option>
            {[
              'Todo Público',
              '13+',
              '16+',
              '18+',
              'Infantiles',
              'Adultos Mayores',
              'LGBTQ+',
            ].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>



 <div>
  <label>Dirección del Evento:</label>
  <input type="text" 
  name="eventAddress" 
  value={formData.eventAddress} 
  onChange={handleChange} 
  required/>
</div>

<div>
  <label className="file-upload" htmlFor="flyerImage" for="flyerImage">Añadir un Flyer Promocional para el evento:</label>
  <input 
    type="file" 
    accept=".jpg,.jpeg,.png" 
    name="flyerImage" 
    id="flyerImage" 
    onChange={handleFileChange}
  />
  <div>
  <label className="file-upload" htmlFor="flyerImage" for="flyerImage">Añadir imagenes del Evento o Lugar:</label>
  <input 
    type="file" 
    accept=".jpg,.jpeg,.png" 
    name="flyerImage" 
    id="flyerImage" 
    onChange={handleFileChange}
  />
  <small>
    Por favor, adjunta una imagen con una resolución recomendada de 1080x1080 píxeles para una mejor visualización.
  </small>
</div>
</div>

<div>
  <label>¿Es un evento online o presencial?</label>
  <div className="radio-container">
    <label>
      <input
        type="radio"
        name="eventType"
        value="online"
        checked={formData.eventType === 'online'}
        onChange={handleChange}
      />
      Online
    </label>
    <label>
      <input
        type="radio"
        name="eventType"
        value="presencial"
        checked={formData.eventType === 'presencial'}
        onChange={handleChange}
      />
      Presencial
    </label>
  </div>
</div>

<div className='social-media-links'>
    <label>Añadir enlaces a redes sociales:</ label ><br/>
    <label >Instagram :</label><input 
    type ="text" 
    name='instagramEventName' 
    placeholder='Instagram' 
    value ={formData.instagramEventName} 
    onChange ={handleChange}/><br/>

    <label >Facebook :</label ><input 
    type ='text' 
    name='facebookEventName' 
    placeholder='Facebook'
    value ={formData.facebookEventName }
    onChange ={handleChange}/><br/>
</div>


<div className='country-selection'>
  <label>Pais donde se realiza el evento:</label>
  <select name='country' value={formData.country} onChange={handleChange}>
    <option key="Colombia" value="Colombia">
      &nbsp; Colombia &nbsp;
    </option>
  </select>
</div>

<div className="checkbox-container">
       <label>
         <input
           type="checkbox"
           name="isFree"
           checked={formData.isFree}
           onChange={handleChange}
         />
         ¿Es un evento gratis?
       </label>
     </div>

     
     {!formData.isFree && (
       <div>
         <label>Precio del Evento en USD:</label>
         <input
           type="number"
           min="0"
           step="any"
           name="priceUSD"
           value={formData.priceUSD}
           onChange={handleChange}
           required
         />
       </div>
     )}


<button type ="submit">Enviar Solicitud</button></form >  
</div>
 );
};

export default Form;
