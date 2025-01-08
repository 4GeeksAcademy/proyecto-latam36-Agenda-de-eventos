import React, { useState } from 'react';
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
  priceUSD: ''    
 });

 const handleChange = (e) => {
 const { name, value } = e.target;

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

 if (name === 'isOnlineEvent') {
   setFormData((prevState) => ({
     ...prevState,
     isOnlineEvent : e.target.checked
   }));
   return;
 }

 setFormData((prevState) => ({
    ...prevState,
    [name]: value
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
 <form onSubmit={handleSubmit}>
 <div>
 <label>Nombre del Evento:</label>
 <input 
 type="text"
 name="eventName"
 value={formData.eventName}
 onChange={handleChange}
 required 
 />
 </div>

 <div>
 <label>Descripción del Evento:</label>
 <textarea 
 name="eventDescription"
 placeholder='Máximo de 350 caracteres'
 maxLength="300"
 value={formData.eventDescription}
 onChange={handleChange}
 required 
 />
 </div>

 <div>
 <label>Fecha y Hora del Evento:</label>
 <input 
 type="datetime-local"
 name="eventDateTime"
 value={formData.eventDateTime} 
 onChange={handleChange} 
 required 
 />
 </div>

<div>
        <label>Categoría del Evento:</label>
        <select
          name="audienceCategory"
          value={formData.eventCategory}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Selecciona una categoría del Evento
          </option>
          {[ "Música",
        "Teatro y Danza",
        "Cine",
        "Arte y Exposiciones",
        "Literarios",
        "Conferencias",
        "Talleres y Seminarios",
        "Educación y Aprendizaje",
        "Negocios y Emprendimiento",
        "Deportes",
        "Fitness y Salud",
        "Deportes extremos",
        "Artes Marciales",
        "Familiares",
        "Caridad y Voluntariado",
        "Religión y Espiritualidad",
        "Tecnología",
        "Ciencia",
        "Gastronomía",
        "Bebidas",
        "Moda",
        "Estilo de Vida",
        "Festivales y Carnavales",
        "Celebraciones"].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
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
          {["Todo Público", "13+", "16+", "18+", "Infantiles", "Adultos Mayores" , "LGBTQ+"].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
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
  <label className="file-upload" htmlFor="flyerImage" for="flyerImage">Añadir un Flyer Promocional para el evento:</label>
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

<div >
  <label>Añadir imágenes adicionales para el evento:</label>
  <input type ="file" 
  accept=".jpg,.jpeg,.png," 
  multiple name= "additionalImages " 
  onChange ={handleFileChange}/>
</div >

<div>
  <label>¿Es un evento online o presencial?</label>
  <div>
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


<div><label>Precio del Evento en USD:</label><input 
type ='number' 
min ='0' 
step ='any' 
max='' 
name='priceUSD'
value= {formData.priceUSD} 
onChange= {handleChange} 
required/> 
</div>

<button type ="submit">Enviar Solicitud</button></form >  
 );
};

export default Form;
