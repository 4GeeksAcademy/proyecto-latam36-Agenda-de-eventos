import React from "react";
import "../../styles/cards.css"; // Importa los estilos necesarios

const AutoScrollGallery = () => {
  return (
    <div className="container-fluid">
      <div className="ms-5 mb-4 ps-4"><h2>Eventos cerca de ti</h2></div>
      
      <div className="auto-scroll-gallery">
        
        <a href="#" className="card text-decoration-none text-muted">
          <img
            src="https://via.placeholder.com/300x200"
            className="card-img-top"
            alt="Placeholder"
            style={{ height: "200px", objectFit: "cover" }}
          />
          <div className="card-body">
            <h5 className="card-title">Card title 1</h5>
            <p className="card-text text-wrap">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
          </div>
        </a>

        <a href="#" className="card text-decoration-none text-muted">
          <img
            src="https://via.placeholder.com/300x200"
            className="card-img-top"
            alt="Placeholder"
            style={{ height: "200px", objectFit: "cover" }}
          />
          <div className="card-body">
            <h5 className="card-title">Card title 2</h5>
            <p className="card-text text-wrap">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
          </div>
        </a>

        <a href="#" className="card text-decoration-none text-muted">
          <img
            src="https://via.placeholder.com/300x200"
            className="card-img-top"
            alt="Placeholder"
            style={{ height: "200px", objectFit: "cover" }}
          />
          <div className="card-body">
            <h5 className="card-title">Card title 3</h5>
            <p className="card-text text-wrap">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
          </div>
        </a>

        <a href="#" className="card text-decoration-none text-muted">
          <img
            src="https://via.placeholder.com/300x200"
            className="card-img-top"
            alt="Placeholder"
            style={{ height: "200px", objectFit: "cover" }}
          />
          <div className="card-body">
            <h5 className="card-title">Card title 4</h5>
            <p className="card-text text-wrap">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
          </div>
        </a>

        <a href="#" className="card text-decoration-none text-muted">
          <img
            src="https://via.placeholder.com/300x200"
            className="card-img-top"
            alt="Placeholder"
            style={{ height: "200px", objectFit: "cover" }}
          />
          <div className="card-body">
            <h5 className="card-title">Card title 5</h5>
            <p className="card-text text-wrap">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default AutoScrollGallery;
