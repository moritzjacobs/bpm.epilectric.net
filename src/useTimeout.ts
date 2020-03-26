import {useEffect, DependencyList} from "react";

const useTimeout = (callback: Function, ms = 1000, deps: DependencyList) => {
	useEffect(
		() => {
			const timer = setTimeout(() => callback(), ms);

			return () => {
				clearTimeout(timer);
			};
		},
		[callback, deps, ms]
	);
};

export default useTimeout;
