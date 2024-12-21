const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: localStorage.getItem("token") || null, 
			isAdmin: false,
		},

		actions: {
			setToken: (newToken) => {
				localStorage.setItem("token", newToken);
				setStore({ token: newToken });
			},

			logout: () => {
				setStore({ token: null, isAdmin: false });
				localStorage.removeItem("token");
			},

			checkAdmin: async () => {
				const token = getStore().token || localStorage.getItem("token");
				if (!token) {
					console.error("No hay token para verificar rol de administrador.");
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
						return true; 
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
