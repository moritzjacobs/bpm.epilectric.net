import {useEffect} from "react";

type CallbackFunction = () => void;

const useHotkey = (code:string, callback:CallbackFunction) => {

	useEffect(() => {
		const eventListener = (ev:KeyboardEvent) => {
			if(ev.code === code) {
				// eslint-disable-next-line callback-return
				callback();
			}
		}

		document.addEventListener("keydown", eventListener);

		return () => {
			document.removeEventListener("keydown", eventListener);
		};

	}, [callback, code]);
};

export default useHotkey;
