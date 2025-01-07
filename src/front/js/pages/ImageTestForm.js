import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FormLabel } from "react-bootstrap";
import Navbar from "../component/navbar"

const backend=process.env.BACKEND_URL


const ImageUpload = () => {
    
  const navigate = useNavigate();

    const loadimg= async(e) => {
        e.preventDefault();
        const formData = new FormData();
        let option = e.target.option.value;
        const options = ['1','2','3','4']
        if (!options.includes(option)) { option='1'} //Default option, just to get the url
        console.log('This is the selected option:', option)
  
        formData.append('file',e.target.fileInput.files[0])
        formData.append('id',e.target.id.value)
        console.log(formData)

        let uri='';
        if (option=='1') {uri= `${backend}/api/image`}
        if (option=='2') {uri= `${backend}/api/image?user=${e.target.id.value}`}
        if (option=='3') {uri= `${backend}/api/image?flyer=${e.target.id.value}`}
        if (option=='4') {uri= `${backend}/api/image?img=${e.target.id.value}`}

        const response = await fetch(uri, {
            method: 'POST',
            body: formData, // Use the FormData object as the body
            headers: {
              // Note: Don't manually set the Content-Type header for multipart requests;
              // fetch will set it with the correct boundary.
            },
          })
          if (response.status==200){
            let mediaResponse=await response.json();
            let alertmessage=mediaResponse['msg']+" img url:"+mediaResponse["url"]+" media format:"+mediaResponse['format']+" media type:"+mediaResponse['resource_type'];
            alert(alertmessage);
            navigate("/");
          }
          else { alert("There was a problem uploading the file")}      
    }

    return (
      <>
        <Navbar />
        <form id="uploadForm" className="w-50" onSubmit={loadimg}>
          
            <label className="form-label">Select an image:</label>
            <input className="form-control" type="file" name="file" id="fileInput"></input>
            <h1></h1>
            <select className="form-select" id="option"  name="option" aria-label="Default select example">
              <option defaultValue={"Use image for:"}>Use image for:</option>
              <option value="1">Get url</option>
              <option value="2">User Profile pic</option>
              <option value="3">Event flyer</option>
              <option value="4">Add image to an event</option>
            </select>
            <h1></h1>
            <label className="form-label">User or event id:</label>
            <input className="form-control" type="text" name="id" id="id"></input>
            <input type="submit" value="Upload"></input>
        </form>
      </>
      
    )

}

export default ImageUpload