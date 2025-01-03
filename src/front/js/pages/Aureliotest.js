import React from "react";

const backend=process.env.BACKEND_URL

const ImageUpload = () => {
    

    const loadimg= async(e) => {
        e.preventDefault();
        const formData = new FormData();
    
        fileInput.files[0]=e.target.file.value
        console.log('this is the file:',e.target.file.value)
        console.log('this is the event:',e.target.eventid.value)
        formData.append('file',fileInput.files[0])
        formData.append('eventid',e.target.eventid.value)
        console.log(formData)
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
          }
        
        const response = await fetch(backend+"/api/image", {
            method: 'POST',
            body: formData, // Use the FormData object as the body
            headers: {
              // Note: Don't manually set the Content-Type header for multipart requests;
              // fetch will set it with the correct boundary.
            },
          })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
        
        /* try {
        fetch backend+"/api/imageloader"
        encType="multipart/form-data"
        } catch {

        } */
    }

    return (
        <form onSubmit={loadimg}>
            <input type="file" name="file" id="file"></input>
            <input type="text" name="eventid" id="eventid"></input>
            <input type="submit" value="Upload"></input>
        </form>
    )

}

export default ImageUpload