const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			// getMessage: async () => {
			// 	try{
			// 		// fetching data from the backend
			// 		const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
			// 		const data = await resp.json()
			// 		setStore({ message: data.message })
			// 		// don't forget to return something, that is how the async resolves
			// 		return data;
			// 	}catch(error){
			// 		console.log("Error loading message from backend", error)
			// 	}
			// },
			// changeColor: (index, color) => {
			// 	//get the store
			// 	const store = getStore();

			// 	//we have to loop the entire demo array to look for the respective index
			// 	//and change its color
			// 	const demo = store.demo.map((elm, i) => {
			// 		if (i === index) elm.background = color;
			// 		return elm;
			// 	});

				//reset the global store
				// setStore({ demo: demo });

				  // Acción para verificar rol de admin
				  checkAdmin: async () => {
					const token = localStorage.getItem("token");
					if (!token) return;
	
					try {
						const resp = await fetch(process.env.BACKEND_URL + "/api/check-admin", {
							method: "GET",
							headers: {
								"Authorization": `Bearer ${token}`,
								"Content-Type": "application/json"
							}
						});
	
						if (resp.status === 200) {
							const data = await resp.json();
							setStore({ isAdmin: data.is_admin });
						} else {
							setStore({ isAdmin: false });
						}
					} catch (error) {
						console.error("Error verificando admin:", error);
					}
				},
			}
		}
	};


export default getState;
