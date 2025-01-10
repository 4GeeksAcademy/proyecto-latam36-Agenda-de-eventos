const getState = ({ getStore, setStore, getActions }) => {
    return {
        store: {
            token: localStorage.getItem("token") || null,
            isAdmin: false,
            loading: false,
            userCountry: null,
            lastCheck: null,
        },

        actions: {
            setLoading: (isLoading) => {
                setStore({ loading: isLoading });
            },

            setToken: (newToken) => {
                if (newToken) {
                  localStorage.setItem("token", newToken);
                  setStore({ token: newToken });
                  getActions().checkAdmin();
                } else {
                  localStorage.removeItem("token");
                  setStore({ 
                    token: null, 
                    isAdmin: false, 
                    user: null 
                  });
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
                  setStore({ isAdmin: false, user: null });
                  return false;
                }
        
                const now = Date.now();
                if (store.lastCheck && (now - store.lastCheck) < 300000) { // 300000 ms = 5 minutos
                  return store.isAdmin;
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
                    setStore({ 
                      isAdmin: userData.is_admin || false,
                      user: userData,
                      userCountry: userData.country,
                      lastCheck: now 
                    });
                    return userData.is_admin || false;
                  }
        
                  setStore({ 
                    isAdmin: false, 
                    user: null,
                    lastCheck: now 
                  });
                  return false;
                } catch (error) {
                  console.error("Error verificando rol de admin:", error);
                  setStore({ 
                    isAdmin: false, 
                    user: null,
                    lastCheck: now 
                  });
                  return false;
                }
              },
            
        },
    };
};

export default getState;