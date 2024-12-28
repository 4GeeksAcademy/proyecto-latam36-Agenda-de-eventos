import React from "react";
import "../../styles/home.css";

//componentes
import Navbar from "../component/navbar"
import Jumbotron from "../component/jumbotron"
import AutoScrollGallery from "../component/cards";



const Home = () => {
	return (
		<div id="home-form-container" className="container-fluid">
			<div>
				<Navbar/>
				<Jumbotron/>
				<AutoScrollGallery/>
			</div>
		</div>
	);
};

export default Home;