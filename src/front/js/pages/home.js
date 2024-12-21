import React from "react";
import "../../styles/home.css";

//componentes
import Navbar from "../component/navbar"
import Jumbotron from "../component/jumbotron"



const Home = () => {
	return (
		<div className="container-fluid">
			<div>
				<Navbar/>
				<Jumbotron/>
			</div>
		</div>
	);
};

export default Home;