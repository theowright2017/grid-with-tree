import { Day } from "./config";


export type ISODuration = {
	ISODAY: number;
	ISOWEEK: number;
	ISOYEAR: number;
	endDay: number;
	endWeek: number;
	endYear: number;
	startMinsAfterMidnight: number;
	endMinsAfterMidnight: number;
};

export type Session = {
	id: number;
	// day: Day;
	isoDuration: ISODuration;
};

const isoGenerator = (
	startDay: number,
	endDay: number,
	startMins: number,
	endMins: number
): ISODuration => {
	return {
		ISODAY: startDay,
		ISOWEEK: 1,
		ISOYEAR: 2023,
		endDay: endDay,
		endWeek: 1,
		endYear: 2023,
		startMinsAfterMidnight: startMins,
		endMinsAfterMidnight: endMins,
	};
};

const isoList = [
	isoGenerator(1, 1, 600, 720),
	isoGenerator(1, 1, 500, 560),
	isoGenerator(1, 1, 780, 840),
	isoGenerator(1, 1, 660, 720),
	isoGenerator(1, 1, 840, 900),
	isoGenerator(1, 1, 720, 780),
	isoGenerator(1, 1, 600, 720),
	isoGenerator(1, 1, 720, 745),
	isoGenerator(1, 1, 720, 820),
	isoGenerator(1, 1, 720, 780),
]

// 8

export const sessionListGenerator = (length: number): Session[] => {
	const sessions = Array.from({ length: length }, (__, idx) => idx).map((index) => {
		const isoDuration = isoList[Math.floor(Math.random() * 10)]
		const session: Session = {
			id: index,
			// day: day,
			isoDuration: isoDuration,
		};

		return session;
	});

	return sessions;
};
