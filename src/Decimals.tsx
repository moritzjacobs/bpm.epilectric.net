import React, {ReactNode, Fragment} from "react";
import "./Decimals.scss";

type Props = {
	children?: ReactNode;
	value?: number;
	decimals?: number;
};

const Decimals = ({children, value, decimals = 2}: Props) => {
	let displayValue = 0;

	if (children || value) {
		const childrenValue = children ? parseFloat(children.toString()) : 0;

		displayValue = typeof value === "undefined" ? childrenValue : value;
	}

	const integer = Math.floor(displayValue);
	const decimalPart = Math.floor((displayValue % 1) * 10 ** decimals);

	return (
		<p className="decimals">
			<span className="decimals__int">{integer}</span>
			{decimals > 0 && (
				<Fragment>
					<span className="decimals__sep">.</span>
					<span className="decimals__decimals">{decimalPart}</span>
				</Fragment>
			)}
		</p>
	);
};

export default Decimals;
