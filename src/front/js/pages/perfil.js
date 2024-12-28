import React from 'react';
import Navbar from '../component/navbar';

const Perfil = ({ user }) => {
    const placeholderUser = {
      first_name: user?.first_name || 'Nombre Placeholder',
      last_name: user?.last_name || 'Apellido Placeholder',
      user_country: user?.user_country || 'País Placeholder',
      user_city: user?.user_city || 'Ciudad Placeholder',
      birthdate: user?.birthdate || 'Fecha de Nacimiento Placeholder',
      profile_picture: user?.profile_picture || 'https://via.placeholder.com/150',
    };


    return (
      <div>
        <Navbar/>
        <div className="container mt-5">
          <div className="card-header bg-dark mb-5 text-white">
              <h2>Perfil del Usuario</h2>
            </div>
          <div className="card mb-5">
            
            <div className="card-body d-flex align-items-center">
              <div className="flex-grow-1">
                <p><strong>Nombre:</strong> {placeholderUser.first_name}</p>
                <p><strong>Apellido:</strong> {placeholderUser.last_name}</p>
                <p><strong>País:</strong> {placeholderUser.user_country}</p>
                <p><strong>Ciudad:</strong> {placeholderUser.user_city}</p>
                <p><strong>Fecha de Nacimiento:</strong> {placeholderUser.birthdate}</p>
              </div>
              <img 
                src={placeholderUser.profile_picture} 
                alt="Foto de perfil" 
                className="rounded-circle ms-3" 
                style={{ width: '150px', height: '150px' }}
              />
            </div>
          </div>
        </div>
        </div>
      );
    };
    
    export default Perfil;