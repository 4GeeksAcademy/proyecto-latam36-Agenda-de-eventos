const getState = ({ getStore, setStore, getActions }) => {
    return {
        store: {
            token: localStorage.getItem("token") || null,
            isAdmin: false,
            loading: false,
        },

        actions: {
            setLoading: (isLoading) => {
                setStore({ loading: isLoading });
            },

            setToken: (newToken) => {
                localStorage.setItem("token", newToken);
                setStore({ token: newToken });
            },

            logout: () => {
                setStore({ token: null, isAdmin: false });
                localStorage.removeItem("token");
            },

            verifyToken: async () => {
                const { setLoading } = getActions();
                setLoading(true); 
                const token = localStorage.getItem("token");
                if (!token) {
                    setStore({ token: null, isAdmin: false });
                    setLoading(false);
                    return;
                }

                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/verify-token", {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (resp.ok) {
                        setStore({ token });
                    } else {
                        setStore({ token: null, isAdmin: false });
                        localStorage.removeItem("token");
                    }
                } catch (error) {
                    console.error("Error verificando el token:", error);
                    setStore({ token: null, isAdmin: false });
                    localStorage.removeItem("token");
                } finally {
                    setLoading(false);
                }
            },
            

            checkAdmin: async () => {
                const token = getStore().token;
                if (!token) {
                    setStore({ isAdmin: false });
                    return false;
                }

                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/check-admin", {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (resp.ok) {
                        const data = await resp.json();
                        setStore({ isAdmin: data.is_admin });
                        return data.is_admin;
                    } else {
                        setStore({ isAdmin: false });
                        return false;
                    }
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
