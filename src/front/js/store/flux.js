const getState = ({ getStore, setStore, getActions }) => {
    return {
        store: {
            token: localStorage.getItem("token") || null,
            isAdmin: false,
            loading: false,
            userCountry: null,
        },

        actions: {
            setLoading: (isLoading) => {
                setStore({ loading: isLoading });
            },

            setToken: (newToken) => {
                localStorage.setItem("token", newToken);
                setStore({ token: newToken });
                getActions().checkAdmin();
                if (newToken) {
                    setTimeout(() => {
                        getActions().verifyToken();
                    }, 300000); // 5 minutos
                }
            },

            setUserCountry: (country) => {
                setStore({ userCountry: country });
            },

            logout: () => {
                setStore({ token: null, isAdmin: false, userCountry: null });
                localStorage.removeItem("token");
                alert("You have logged out successfully.");
                window.location.href = "/login"; 
            },

            verifyToken: async () => {
                const store = getStore();
                const { setLoading, setToken } = getActions();
                
                if (!store.token) {
                    return false;
                }
            
                setLoading(true);
                
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/users/token/verify", {
                        headers: { 
                            Authorization: `Bearer ${store.token}`,
                            "Content-Type": "application/json"
                        },
                    });
            
                    const isValid = resp.ok;
                    if (!isValid) {
                        setStore({ token: null, isAdmin: false });
                        localStorage.removeItem("token");
                        alert("Your session has expired. You will be redirected to login.");
                        window.location.href = "/login"; 
                    }
                    
                    return isValid;
                } catch (error) {
                    console.error("Error verificando el token:", error);
                    setStore({ token: null, isAdmin: false });
                    localStorage.removeItem("token");
                    alert("An error occurred while verifying the token. You will be redirected to login.");
                    window.location.href = "/login";
                    return false;
                } finally {
                    setLoading(false);
                }
            },
            

            checkAdmin: async () => {
                const store = getStore();
                
                if (!store.token) {
                    setStore({ isAdmin: false });
                    return false;
                }
            
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/users/me", {
                        headers: {
                            Authorization: `Bearer ${store.token}`,
                            "Content-Type": "application/json",
                        },
                    });
            
                    if (resp.ok) {
                        const userData = await resp.json();
                        const isAdmin = userData.is_admin || false;
                        setStore({ isAdmin });
            
                        getActions().setUserCountry(userData.country);
                        return isAdmin;
                    }
            
                    setStore({ isAdmin: false });
                    return false;
                    
                } catch (error) {
                    console.error("Error verificando rol de admin:", error);
                    setStore({ isAdmin: false });
                    return false;
                }
            },

            
        },
    };
};

export default getState;