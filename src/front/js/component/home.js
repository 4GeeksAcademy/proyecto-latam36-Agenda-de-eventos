import React from "react";

//componentes
import {Navbar} from "./Navbar";
import {Jumbotron} from "./Jumbotron";
import {Footer} from "./Footer";




const Home = () => {
	return (
		<div className="container-fluid">
			<div>
				<Navbar/>
			</div>
            <div>
				<Jumbotron/>
            </div>
			<div>
				<Footer/>
			</div>
		</div>
	);
};

export default Home;
