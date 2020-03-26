import React from "react";
import cn from "classnames";
import "./UnitDisplay.scss";

type Props = {
	children: React.ReactNode;
	unit: string;
	className?: string;
};

const UnitDisplay = ({children, unit, className}: Props) => {
	return (
		<div className={cn("unit", className)}>
			<div className="unit__slot">{children}</div>
			<div className="unit__unit">{unit}</div>
		</div>
	);
};

export default UnitDisplay;
