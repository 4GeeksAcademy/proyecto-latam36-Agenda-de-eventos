import React, { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Context } from "./store/appContext";

import injectContext from "./store/appContext";

import Footer from "./component/footer";
import AuthRequired from "./component/AuthRequired";

import Home from "./pages/home";
import EventsForm from "./pages/EventsForm";
import EventsDetails from "./pages/EventsDetails";
import AdminEventRequests from "./pages/AdminEventRequests";
import Perfil from "./pages/perfil";
import ImageUpload from "./pages/ImageTestForm.js";
import AboutUs from "./pages/aboutUs.js";
import FilteredEvents from "./pages/FilteredEvents.js";

const Layout = () => {
    const { store, actions } = useContext(Context);
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<EventsForm/>} path="/EventsForm"/>
                        <Route element={<EventsDetails/>} path="/EventsDetails/:id"/>
                        <Route element={<FilteredEvents/>} path="/FilteredEvents/:category"/>
                        <Route element={<AdminEventRequests/>} path="/AdminEventRequests"/>
                        <Route element={<ImageUpload/>} path="/ImageTestForm"/>
                        <Route element={<Perfil/>} path="/perfil" />
                        <Route element={<ImageUpload/>} path="/image" />
                        <Route element={<AuthRequired />} path="/auth-required" />
                        <Route element={<AboutUs/>} path="/AboutUs"/>
                        <Route element={<h1>Not found!</h1>} path="*" />
                    </Routes>
                    {store.showAuthModal && (
                        <AuthRequired
                            onClose={actions.closeAuthModal}
                            onSuccessPath={store.authModalProps.onSuccessPath}
                            authTitleProps={{
                                condition: store.authModalProps.condition
                            }}
                        />
                    )}
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);