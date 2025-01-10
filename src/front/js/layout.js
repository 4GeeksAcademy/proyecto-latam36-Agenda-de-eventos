import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import injectContext from "./store/appContext";

// import Breadcrumbs from "./component/Breadcrumbs.jsx";
// import Navbar from "./component/navbar";
import Footer from "./component/footer";

import Home from "./pages/home";
import Login from './pages/login';
import Signup from "./pages/signup";
import EventsForm from "./pages/EventsForm"
import EventsDetails from "./pages/EventsDetails"
import AdminEventRequests from "./pages/AdminEventRequests"
import Perfil from "./pages/perfil";
import ImageUpload from "./pages/ImageTestForm.js";
import AboutUs from "./pages/aboutUs.js";
import FilteredEvents from "./pages/FilteredEvents.js";



//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    {/* <Navbar /> */}
                    {/* <Breadcrumbs /> */}
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Signup />} path="/signup"/>
                        <Route element={<EventsForm/>} path="/EventsForm"/>
                        <Route element={<EventsDetails/>} path="/EventsDetails/:id"/>
                        <Route element={<FilteredEvents/>} path="/FilteredEvents/:category"/>
                        <Route element={<AdminEventRequests/>} path="/AdminEventRequests"/>
                        <Route element={<ImageUpload/>} path="/ImageTestForm"/>
                        <Route element={<Perfil/>} path="/perfil" />
                        <Route element={<ImageUpload/>} path="/image" />
                        <Route element={<h1>Not found!</h1>} />
                        <Route element={<AboutUs/>} path="/AboutUs"/>
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
