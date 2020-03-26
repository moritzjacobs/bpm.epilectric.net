import React from "react";
import {getMedian, Beat as BeatType, getDeltas} from "./bpm";
import "./Beats.scss";

type BeatsProps = {
	events: Array<BeatType>;
};

type BeatProps = {
	size: number;
};

const Beat = ({size}: BeatProps) => {
	return (
		<div
			className="beats__beat"
			style={{
				height: `${size * 100}%`
			}}
		/>
	);
};

const Beats = ({events}: BeatsProps) => {
	if (events.length < 2) {
		return null;
	}
	const deltas = getDeltas(events);
	const median = getMedian(events);

	const max = Math.max(...deltas);
	const min = Math.min(...deltas);

	return (
		<div className="beats">
			{deltas.map((event, index) => {
				const size = (event - min) / (max - min);

				return (
					// eslint-disable-next-line react/no-array-index-key
					<Beat key={`beat-${index}-${size}`} size={size / 2 + 0.5} />
				);
			})}

			<div
				className="beats__median"
				style={{height: `${(median - min) / (max - min) * 100}%`}}
			/>
		</div>
	);
};

export default Beats;
