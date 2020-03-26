import {useRef, RefObject} from "react";

const useOneShotAnimation = <T extends HTMLElement>(
	className: string,
	timeout?: number
): [RefObject<T>, () => void] => {
	const ref = useRef<T>(null);

	const animationEnd = () => {
		if (ref.current) {
			ref.current.classList.remove(className);
		}
	};

	const trigger = () => {
		if (ref.current) {
			ref.current.classList.add(className);
			ref.current.addEventListener("animationend", animationEnd);
			ref.current.addEventListener("webkitAnimationEnd", animationEnd);
			if(timeout) {
				setTimeout(animationEnd, timeout);
			}
		}
	};

	return [ref, trigger];
};

export default useOneShotAnimation;
