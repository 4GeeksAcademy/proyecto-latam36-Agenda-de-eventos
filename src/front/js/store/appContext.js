	import React, { useState, useEffect } from "react";
	import getState from "./flux.js";

	// Don't change, here is where we initialize our context, by default it's just going to be null.
	export const Context = React.createContext(null);

	// This function injects the global store to any view/component where you want to use it, we will inject the context to layout.js, you can see it here:
	// https://github.com/4GeeksAcademy/react-hello-webapp/blob/master/src/js/layout.js#L35
	const injectContext = PassedComponent => {
		const StoreWrapper = props => {
			//this will be passed as the contenxt value
			const [state, setState] = useState(
				getState({
					getStore: () => state.store,
					getActions: () => state.actions,
					setStore: updatedStore =>
						setState({
							store: Object.assign(state.store, updatedStore),
							actions: { ...state.actions }
						})
				})
			);

			useEffect(() => {
				const initializeApp = async () => {
					try {
						const tokenVerified = await state.actions.verifyToken();
						if (tokenVerified) {
							await state.actions.checkAdmin();
						}
					} catch (error) {
						console.error("Error en la inicialización de la app:", error);
						alert("An error occurred. Please try again later.");
					}
				};
			
				initializeApp();
			
				// Renovar token cada 5 minutos
				const tokenInterval = setInterval(async () => {
					await state.actions.verifyToken();
				}, 300000); // 5 minutos
			
				return () => {
					clearInterval(tokenInterval);
				};
			}, []);
			
			return (
				<Context.Provider value={state}>
					<PassedComponent {...props} />
				</Context.Provider>
			);
		};
		return StoreWrapper;
	};

	export default injectContext;
