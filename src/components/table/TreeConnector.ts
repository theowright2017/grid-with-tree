// @ts-nocheck

import IntervalTree from "@/tree/IntervalTree";
import { getSlotFromDurationMins } from "../helpers/gridHelpers";

export function buildSubRowsForDay(sessionList, config) {
    const tree = new IntervalTree();

	// sessionList.forEach((session) => {
	// 	const startSlot = Math.floor(getSlotFromDurationMins(
	// 		session.isoDuration.startMinsAfterMidnight,
	// 		config
	// 	));
	// 	const endSlot = Math.ceil(getSlotFromDurationMins(
	// 		session.isoDuration.endMinsAfterMidnight,
	// 		config
	// 	));

    //     tree.insert([startSlot, endSlot], session.id)
	// });
    // console.log(tree)

    return []
}
