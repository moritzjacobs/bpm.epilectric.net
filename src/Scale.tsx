import React, {ReactNode} from "react";
import classnames from "classnames";
import Decimals from "./Decimals";
import {Beat, Beats} from "./bpm";
import ClickToCopy from "./ClickToCopy"
import "./Scale.scss";

const OCTAVE = [
	"c",
	"c#",
	"d",
	"d#",
	"e",
	"f",
	"f#",
	"g",
	"g#",
	"a",
	"a#",
	"b"
] as const;

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
	infer ElementType
>
	? ElementType
	: never;

type Note = ElementType<typeof OCTAVE>;

type ScaleProps = {
	bpms: Beats;
};

type KeyProps = {
	children: ReactNode;
	note: Note;
};

const PianoKey = ({children, note}: KeyProps) => {
	const isSemitone = note.endsWith("#");

	return (
		<>
			<ClickToCopy
				className={classnames("scale__key", {
					"scale__key--is-semitone": isSemitone
				})}
			>
				{children}
			</ClickToCopy>
		</>
	);
};

const Scale = ({bpms}: ScaleProps) => {
	const rootCIndex = Math.floor(bpms.length / 2);
	const normalizedScale = [
		...OCTAVE.slice(rootCIndex),
		...OCTAVE.slice(0, rootCIndex)
	];

	return (
		<div className="scale">
			{bpms.map((bpm: Beat, i: number) => {
				const note = normalizedScale[i];

				return (
					<PianoKey note={note} key={bpm}>
						<Decimals>{bpm}</Decimals>
					</PianoKey>
				);
			})}
		</div>
	);
};

export default Scale;
