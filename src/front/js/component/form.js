import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "../../styles/eventForm.css";
import "../../styles/spinners.css";
import { MdToken } from 'react-icons/md';

const backend=process.env.BACKEND_URL

const Form = () => {
            const [formLoading, setFormLoading] = useState(false);
            const [flyerFile, setFlyerFile] = useState("")
            const [imageFile, setImageFile] = useState(null)
            const token = localStorage.getItem("token");
            console.log("this is the token:",token)
            const navigate = useNavigate();     

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
                        city:'Bogotá',
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
      console.log(e.target.files[0]['name'])
      setFlyerFile(e.target.files[0]['name'])
      /*setFormData((prevState) => ({
      ...prevState,
      flyerImage : e.target.flyerImage.files[0]
      }));*/
      
      }

      if (name === 'image[]') {
            console.log(e.target.files.length)
            setImageFile(e.target.files.length)
      /* setFormData((prevState) => ({
            ...prevState,
            additionalImages : [...e.target.files]
      }));*/
      }
 };

async function imageUpload(imageInput) {
      const formImage = new FormData();
      formImage.append('file',imageInput)
      let uri= `${backend}/api/image`

      const response = await fetch(uri, {
                                          method: 'POST',
                                          body: formImage, // Use the FormData object as the body
                                          headers: {},
                                          })
      if (response.status==200){
                        const mediaResponse=await response.json();
                        const mediaUrl=mediaResponse["media_url"]
                        const mediaType=mediaResponse["resource_type"]
                        //let alertmessage=mediaResponse['msg']+" img url:"+mediaResponse["media_url"]+"format:"+mediaResponse['format']+"type:"+mediaResponse['resource_type'];
                        //alert(alertmessage);
                        return {"mediaUrl":mediaUrl,
                                "mediaType":mediaType
                        }
                              //navigate("/");
                        }
      else { alert("There was a problem uploading the file");
            return
      }
      

}

 const handleSubmit = async(e) => {
            e.preventDefault();
            setFormLoading(true); 
            const mediaFilesArray=[];

            console.log('this is the flyer:',e.target.flyerImage.files[0])
            const fileArray = e.target.image.files
            console.log('number of files:',fileArray.length)
                  
            const flyerUrl= await imageUpload(e.target.flyerImage.files[0])
            console.log("Flyer URL:",flyerUrl['mediaUrl'])

            for (let i=0; i < fileArray.length;i++) {
                  let eventImgUrl= await imageUpload(fileArray[i])
                  mediaFilesArray.push(eventImgUrl)     
            };

            console.log('these are the images:',mediaFilesArray)
            const mediaArrayJson = []
            for (let i=0; i < mediaFilesArray.length;i++){
                  mediaArrayJson.push({"media_type":mediaFilesArray[i]['mediaType'],
                                          "media_url":mediaFilesArray[i]['mediaUrl']
                                          })
            }
            console.log('Here the media array JSON:', mediaArrayJson)
            const contactInfoArray = [{"contact_media":"facebook",
                  "contact_data":formData.facebookEventName},
                  {"contact_media":"Instagram",
                  "contact_data":formData.instagramEventName}]


                  const uri = `${backend}/api/events`
                  const response = await fetch(uri, {
                      method: 'POST',
                      headers: { 
                          Authorization: `Bearer ${token}`,
                          'Content-Type': 'application/json' 
                      },
                      body: JSON.stringify({
                          "event_name": formData.eventName,
                          "event_description": formData.eventDescription,
                          "event_date": formData.eventDateTime.split('T')[0],
                          "event_start_time": formData.eventDateTime.split('T')[1],
                          "event_duration": "0:00",
                          "ticket_price": formData.isFree ? 0 : Number.parseFloat(formData.priceUSD),
                          "event_address": formData.eventAddress,
                          "event_city": formData.city,
                          "event_country": formData.country,
                          "event_category": formData.eventCategory,
                          "age_clasification": formData.audienceCategory,
                          "flyer_img_url": flyerUrl["mediaUrl"],
                          "event_media": mediaArrayJson,
                          "contact_info": contactInfoArray
                      })
                  })
            setFormLoading(false);
            if (response.status==201){
                        const eventResponse=await response.json();
                        console.log(eventResponse)
                        alert('Evento creado existosamente')
                        setTimeout(() => navigate('/'), 2000);
                        return 
                             
                        }
            else { alert("There was an error with information");
                        console.log(response.code)
                        return
      }

 console.log('Formulario enviado con los siguientes datos:', formData);
 };


 return (
<div className='form-page'>
    <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-header">
              <Link to="/">
                  <img className="logo"
                        src="https://res.cloudinary.com/dj6gqmozm/image/upload/f_auto,q_auto/nqyo2gpte9c8kwsgqlbn"
                        alt="logo-culturalWave"/>
              </Link>
        </div>

        <div>
              <p className="form-title">Formulario para Solicitar Evento</p>
        </div>

        <div className="form-group">
              <label>Nombre del Evento:</label>
              <input type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    required/>
        </div>

        <div className="form-group">
              <label>Descripción del Evento:</label>
              <textarea name="eventDescription"
                        placeholder="Máximo de 1000 caracteres"
                        maxLength="1000"
                        value={formData.eventDescription}
                        onChange={handleChange}
                        required/>
        </div>

        <div className="form-group">
              <label>Fecha y Hora del Evento:</label>
              <input type="datetime-local"
                      name="eventDateTime"
                      value={formData.eventDateTime}
                      onChange={handleChange}
                      required/>
        </div>

        <div className="form-row">
            <div className="form-group">
                <label>Categoría del Evento:</label>
                <select name="eventCategory"
                        value={formData.eventCategory}
                        onChange={handleChange}
                        required>

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
                <select name="audienceCategory"
                        value={formData.audienceCategory}
                        onChange={handleChange}
                        required>

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
            <label className="file-upload" htmlFor="flyerImage">Añadir un Flyer Promocional para el evento:</label>
            <input type="file" 
                    accept=".jpg,.jpeg,.png" 
                    name="flyerImage" 
                    id="flyerImage"
                    onChange={handleFileChange} 
                    />
            <span>{ "  " + flyerFile }</span>
            <div>
                  <label className="file-upload" htmlFor="image">Añadir imagenes del Evento o Lugar:</label>
                  <input type="file" 
                          accept=".jpg,.jpeg,.png" 
                          name="image[]" 
                          id="image" 
                          onChange={handleFileChange} multiple />
                  <span>{ imageFile ? " "+imageFile+" Imagenes por cargar" : null}</span>
                  <small>
                        Por favor, adjunta una imagen con una resolución recomendada de 1080x1080 píxeles para una mejor visualización.
                  </small>
                  
            </div>
      </div>

      <div>
          <label>¿Es un evento online o presencial?</label>
          <div className="radio-container">
                <label>
                <input type="radio"
                        name="eventType"
                        value="online"
                        checked={formData.eventType === 'online'}
                        onChange={handleChange} />
                  Online
                </label>
                <label>
                <input type="radio"
                        name="eventType"
                        value="presencial"
                        checked={formData.eventType === 'presencial'}
                        onChange={handleChange} />
                  Presencial
                </label>        
          </div>
      </div>

      <div className='social-media-links'>
            <label>Añadir enlaces a redes sociales:</ label ><br/>
            <label >Instagram :</label>
            <input type ="text" 
                  name='instagramEventName' 
                  placeholder='Instagram' 
                  value ={formData.instagramEventName} 
                  onChange ={handleChange}/><br/>

            <label >Facebook :</label >
            <input type ='text' 
                    name='facebookEventName' 
                    placeholder='Facebook'
                    value ={formData.facebookEventName }
                    onChange ={handleChange}/><br/>
      </div>


      <div className='country-selection'>
            <label>Ciudad donde se realiza el evento:</label>
            <select name='city' value={formData.city} onChange={handleChange}>
                  <option key="Bogotá" value="Bogotá">&nbsp; Bogotá &nbsp;</option>
                  <option key="Medellin" value="Medellin">&nbsp; Medellin &nbsp;</option>
                  <option key="Cali" value="Cali">&nbsp; Cali &nbsp;</option>
                  <option key="Cartagena" value="Cartagena">&nbsp; Cartagena &nbsp;</option>
                  <option key="Pereira" value="Pereira">&nbsp; Pereira &nbsp;</option>
            </select>
            <label>Pais donde se realiza el evento:</label>
            <select name='country' value={formData.country} onChange={handleChange}>
                <option key="Colombia" value="Colombia">
                        &nbsp; Colombia &nbsp;
                </option>
            </select>
      </div>

      <div className="checkbox-container">
            <label>
            <input type="checkbox"
                   name="isFree"
                   checked={formData.isFree}
                   onChange={handleChange}/>
                ¿Es un evento gratis?
            </label>
      </div>
     
     {!formData.isFree && (
       <div>
         <label>Precio del Evento en USD:</label>
         <input type="number"
                min="0"
                step="any"
                name="priceUSD"
                value={formData.priceUSD}
                onChange={handleChange}
                required/>
      </div>
     )}


            <button type ="submit">{ formLoading ? 'Enviando...' : 'Enviar Solicitud'}</button>
            <div className={formLoading ? "dots-spinner" : null }>
              <div></div>
              <div></div>
              <div></div>       
            </div>
    </form >  
</div>
 );
};

export default Form;
