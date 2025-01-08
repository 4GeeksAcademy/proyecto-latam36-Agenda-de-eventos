import React, { useState, useContext } from "react";
import EventFilters from "../component/EventFilters";
import AutoScrollGallery from "../component/cards";
import { Context } from "../store/appContext";

const Filters = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isOnline, setIsOnline] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState("Todos");
  const [ageClassification, setAgeClassification] = useState("Todos");

  const { store } = useContext(Context);
  const { user } = store;

  const filters = {
    category: selectedCategory,
    isOnline: isOnline,
    price: selectedPrice,
    ageClassification: ageClassification,
  };

  return (
    <div className="events-page">
      <EventFilters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
        selectedPrice={selectedPrice}
        setSelectedPrice={setSelectedPrice}
        ageClassification={ageClassification}
        setAgeClassification={setAgeClassification}
      />
      
        <div className="scroll-gallery mt-5">
          <AutoScrollGallery filters={filters} />
        </div>
        
    </div>
  );
};

export default Filters;