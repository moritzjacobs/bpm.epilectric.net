import {useState} from "react";
import {Beat} from "./bpm";

const useBpmEvents = () => {
	const [nextTime, setNextTime] = useState(false);
	const [events, setEvents] = useState<Array<Beat>>([]);

	const resetNextTime = () => {
		setNextTime(true);
	};

	const reset = () => setEvents([]);

	const trigger = (callback?:Function) => {
		if (typeof callback === "function") {
			// eslint-disable-next-line callback-return
			callback();
		}

		if (nextTime) {
			setNextTime(false);
			setEvents([Date.now()]);
		} else {
			setEvents([...events, Date.now()]);
		}
	};

	return {
		resetNextTime,
		events,
		trigger,
		reset
	};
};

export default useBpmEvents;
