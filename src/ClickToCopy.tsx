import React from "react";
import cn from "classnames";
import {getTextContentFromChildren} from "./utils";
import useOneShotAnimation from "./useOneShotAnimation";
import "./ClickToCopy.scss";

type Props = React.HTMLAttributes<HTMLButtonElement> & {
	children: React.ReactNode;
	value?: string;
};

const copy = async (value: string) => {
	return navigator.clipboard.writeText(value);
};

const ClickToCopy = ({children, value, className, ...rest}: Props) => {
	const [ref, trigger] = useOneShotAnimation<HTMLDivElement>("click-to-copy--copied", 3000);

	if (typeof value === "undefined") {
		value = getTextContentFromChildren(children);
	}

	const handleClick = async () => {
		trigger();
		copy(value as string);
	};

	return (
		<button
			type="button"
			className={cn(className, "click-to-copy")}
			onClick={handleClick}
			{...rest}
		>
			{children}
			<div ref={ref} className="click-to-copy__overlay" />
		</button>
	);
};

export default ClickToCopy;
