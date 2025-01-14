const getState = ({ getStore, setStore, getActions }) => {
  return {
      store: {
          token: localStorage.getItem("token") || null,
          isAdmin: false,
          loading: false,
          userCountry: null,
          lastCheck: null,
          showAuthModal: false,
          authModalProps: {}
      },

      actions: {
          openAuthModal: (redirectPath, condition = '') => {
              setStore({
                  showAuthModal: true,
                  authModalProps: {
                      onSuccessPath: redirectPath,
                      condition: condition
                  }
              });
          },

          closeAuthModal: (onCloseAction = null) => {
              const store = getStore();
              setStore({
                  showAuthModal: false,
                  authModalProps: {}
              });

              if (!store.token) {
                  getActions().clearUserData();
                  window.location.href = '/';
              } else if (onCloseAction) {
                  onCloseAction();
              }
          },

          clearUserData: () => {
              localStorage.removeItem("token");
              setStore({
                  token: null,
                  isAdmin: false,
                  user: null,
                  userCountry: null
              });
          },

          setToken: (newToken) => {
              if (newToken) {
                  localStorage.setItem("token", newToken);
                  setStore({ token: newToken });
                  getActions().checkAdmin();
                  getActions().closeAuthModal();
              } else {
                  getActions().clearUserData();
              }
          },

          logout: () => {
            setStore({ 
                token: null, 
                isAdmin: false, 
                userCountry: null,
                showAuthModal: false 
            });
            localStorage.removeItem("token");
            window.location.href = "/";
        },

          verifyToken: async () => {
              const store = getStore();
              const { setLoading } = getActions();
              
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
          
                  if (!resp.ok) {
                      handleTokenExpiration(getStore(), getActions());
                      return false;
                  }
                  
                  return true;
              } catch (error) {
                  console.error("Error verificando el token:", error);
                  handleTokenExpiration(getStore(), getActions());
                  return false;
              } finally {
                  setLoading(false);
              }
          },

          checkAdmin: async () => {
              const store = getStore();
              const { setShowAuthModal } = getActions();
              
              if (!store.token) {
                  setStore({ isAdmin: false, user: null });
                  return false;
              }
      
              const now = Date.now();
              if (store.lastCheck && (now - store.lastCheck) < 300000) {
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