import {useState} from "react";

const useToggle = (initial = false): [boolean, () => void] => {
	const [on, setter] = useState<boolean>(initial);

	return [on, () => setter(v => !v)];
};

export default useToggle;
