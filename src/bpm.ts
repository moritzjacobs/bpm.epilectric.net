const SEMITONE_RATIO = 0.9438;
const MAX_WEIGHTING = 0.75;

export type Beat = number;
export type Beats = Array<Beat>;
type BpmReading = number | null;

export const getConfidence = (beats: Beats): number => {
	if (beats.length === 0) {
		return 0;
	}
	const deltas = getDeltas(beats);
	const median = getMedian(beats);
	const offAMinute = beats.length / 60;

	const badDeviations = deltas
		.map(delta => {
			const deviation = Math.abs(delta - median) / median;

			return deviation > 0.1;
		})
		.filter(Boolean).length;

	return offAMinute - (badDeviations / 20);
};

const bpmFromCounting = (beats: Beats): BpmReading => {
	if (beats.length > 2) {
		const startMeasure = beats[0];
		const endMeasure = beats.slice(-1)[0];

		const measuredTime = endMeasure - startMeasure;

		return (beats.length - 1) * (60000 / measuredTime);
	}

	return null;
};

export const getDeltas = (beats: Beats): Beats => {
	let lastMeasure = 0;

	return beats
		.map((ev, i) => {
			const delta = i > 0 ? ev - lastMeasure : 0;

			lastMeasure = ev;

			return delta;
		})
		.slice(1);
};

export const getMedian = (beats: Beats): Beat => {
	if (beats.length < 1) {
		throw new Error("Cannot get median from empty array");
	}

	const deltas = getDeltas(beats);
	const deltasSorted = [...deltas].sort((a, b) => a - b);

	return deltasSorted[Math.floor(deltasSorted.length / 2)];
};

const bpmFromMeasuring = (beats: Beats): BpmReading => {
	if (beats.length > 1) {
		const median = getMedian(beats);

		return 60000 / median;
	}

	return null;
};

export const bpmFromBeats = (beats: Beats) => ({
	counting: bpmFromCounting(beats),
	measuring: bpmFromMeasuring(beats)
});

export const scaleBpm = (
	bpm: number,
	up: number,
	down: number
): Array<number> => {
	const scaleUp = [...Array(up)].map(
		(_, i) => bpm * (1 / SEMITONE_RATIO) ** (i + 1)
	);
	const scaleDown = [...Array(down)].map(
		(_, i) => bpm * SEMITONE_RATIO ** (down - i)
	);

	return [...scaleDown, bpm, ...scaleUp];
};

export const weightBpm = (
	counting: number,
	measuring: number,
	confidence: number
) => {
	const f = confidence > MAX_WEIGHTING ? MAX_WEIGHTING : confidence;
	const countingWeighted = f * counting;
	const measuringWeighted = (MAX_WEIGHTING - f) * measuring;

	return (countingWeighted + measuringWeighted) / MAX_WEIGHTING;
};
