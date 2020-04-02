import React, {useState} from "react";
import useBpmEvents from "./useBpmEvents";
import {bpmFromBeats, scaleBpm, weightBpm, getConfidence} from "./bpm";
import Decimals from "./Decimals";
import Scale from "./Scale";
import useHotkey from "./useHotkey";
import useTimeout from "./useTimeout";
import UnitDisplay from "./UnitDisplay";
import ClickToCopy from "./ClickToCopy";
import Beats from "./Beats";
import "./App.scss";
import useOneShotAnimation from "./useOneShotAnimation";

type ViewProps = {
	trigger: () => void;
	reset: () => void;
	confidence?: number;
	bpm?: number;
	scaled: Array<number> | null;
};

type HSLTuple = [number, number];

const mapValue = (
	value: number,
	from: number,
	to: number,
	from2: number,
	to2: number
	// eslint-disable-next-line max-params
) => {
	const range = to - from;
	const range2 = to2 - from2;
	let perc = (value - from) / range;

	perc = perc < 0 ? 0 : perc;
	perc = perc > 1 ? 1 : perc;

	return from2 + perc * range2;
};

const setHSL = ([hue, sat]: HSLTuple) => {
	document.documentElement.style.setProperty("--hue", `${Math.round(hue)}`);
	document.documentElement.style.setProperty("--sat", `${Math.round(sat)}%`);
};

const App = () => {
	const [manualValue, setManualValue] = useState(100);
	const {events, trigger, reset, resetNextTime} = useBpmEvents();

	const enterManually = () => {
		// eslint-disable-next-line no-alert
		const newManualValue = prompt("BPM?");

		setManualValue(parseFloat(newManualValue ?? "100"));
	};

	useHotkey("KeyR", reset);
	const [appRef, blink] = useOneShotAnimation<HTMLDivElement>(
		"app--triggered",
		1000
	);

	useHotkey("KeyT", () => trigger(blink));
	useHotkey("KeyS", enterManually);

	useTimeout(resetNextTime, 3000, [events]);

	const beats = events.length;
	const {counting, measuring} = bpmFromBeats(events);
	const confidence = getConfidence(events);

	const bpm =
		counting !== null && measuring !== null
			? weightBpm(counting, measuring, confidence)
			: manualValue;

	setHSL([
		mapValue(bpm, 70, 200, 0, 255),
		mapValue(confidence, 0, 1, 10, 80)
	]);
	const scaled = bpm ? scaleBpm(bpm, 6, 5) : null;

	return (
		<div ref={appRef} className="app">
			<aside className="toolbar">
				<nav className="unit-like toolbar__buttons">
					<button type="reset" onClick={() => reset()}>
						<u>r</u>eset
					</button>
					<button type="button" onClick={() => enterManually()}>
						<u>s</u>et
					</button>
				</nav>

				{bpm && (
					<div className="unit-like toolbar__item">
						<ClickToCopy value={bpm.toString()}>
							<UnitDisplay unit="BPM">
								<Decimals decimals={2} value={bpm} />
							</UnitDisplay>
						</ClickToCopy>
					</div>
				)}

				<UnitDisplay unit="beats" className="beats__wrapper">
					<Beats events={events} />
					{beats ? <Decimals decimals={0} value={beats} /> : "--"}
				</UnitDisplay>

				<UnitDisplay unit="Confidence in %">
					{confidence ? (
						<Decimals decimals={0} value={confidence * 100} />
					) : (
						"--"
					)}
				</UnitDisplay>
			</aside>

			<main className="main">
				<button
					className="trigger"
					type="button"
					onClick={() => trigger(blink)}
				>
					<u>t</u>rigger
				</button>
			</main>

			<aside className="floating">
				{scaled && <Scale bpms={scaled} />}
			</aside>
		</div>
	);
};

export default App;
