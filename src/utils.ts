import {isValidElement, Children, ReactElement, ReactNode} from "react";

export const getTextContentFromChildren = (children: ReactNode): string => {
	const labels = Children.map(children, child => {
		const hasSubchildren = isValidElement(child);
		const subChildren = hasSubchildren
			? (child as ReactElement)?.props?.children
			: [];

		return hasSubchildren ? getTextContentFromChildren(subChildren) : child;
	});

	return labels ? labels.join(" ") : "";
};
