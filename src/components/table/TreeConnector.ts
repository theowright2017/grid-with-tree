// @ts-nocheck

import IntervalTree from "@/tree/IntervalTree";
import { getSlotFromDurationMins } from "../helpers/gridHelpers";
import { Session } from "@/pages/api/SessionGenerator";

interface SessionSlot {
	interval: [number, number];
	session: Session
}

export function buildSubRowsForDay(sessionList, config) {
    const tree = new IntervalTree();
	// const subRowToTreeMap = new Map([
	// 	[0, new IntervalTree()],
	// ])
	let subRows: SessionSlot[][] = []
	let altRows: [number, number][] = []
	console.time('plotgrid')
	sessionList.forEach((session, idx) => {
		const startSlot = Math.floor(getSlotFromDurationMins(
			session.isoDuration.startMinsAfterMidnight,
			config
		));
		const endSlot = Math.ceil(getSlotFromDurationMins(
			session.isoDuration.endMinsAfterMidnight,
			config
		));

		// console.log('slot--', startSlot, endSlot)

		let hasInserted = false;
		let subRowIndex = 0

		while(!hasInserted) {
			// if (idx === sessionList.length - 1) {
			// 	console.time('tree')
			// }
			// console.log('TR--', altRows)
			const [didInsert, subIdx] = tree.insert([startSlot, endSlot], subRowIndex)
			// console.log('didInsert', didInsert, subIdx)
			// if (idx === sessionList.length - 1) {
			// 	console.timeEnd('tree')
			// }
			// console.log('HAS INSERT--', didInsert)
			if (didInsert) {
				hasInserted = true
				if (!subRows[subIdx]) {
					subRows[subIdx] = []
				} 
					subRows[subIdx].push({interval: [startSlot, endSlot], session})
				
				if (!altRows[subIdx]) {
					altRows[subIdx] = []
				}
				altRows[subIdx].push([startSlot, endSlot])
			} else {
				subRowIndex = subIdx + 1
			}
		}



		// while(!hasInserted) {
			// const tree = subRowToTreeMap.get(subRowIndex)
			// const didInsert = tree.insert([startSlot, endSlot], session.id)
			// if(didInsert) {
			// 	hasInserted = true
			// 	if (!subRows[subRowIndex]) {
			// 		subRows[subRowIndex] = []
			// 	}
			// 	// subRows[subRowIndex].push({
			// 	// 	interval: [startSlot, endSlot],
			// 	// 	session: session
			// 	// })
			// 	subRows[subRowIndex].push()
			// 	// if (!altSubs[subRowIndex]) {
			// 	// 	altSubs[subRowIndex] = []
			// 	// }
			// 	// altSubs[subRowIndex].push([session.isoDuration.startMinsAfterMidnight, session.isoDuration.endMinsAfterMidnight])
			// 	subRowIndex = 0
			// } else if (didInsert === false) {
			// 	subRowIndex++
			// 	if (!subRowToTreeMap.has(subRowIndex)) {
			// 		subRowToTreeMap.set(subRowIndex, new IntervalTree());
			// 	} 
			// } 
		// }

        
	});
	
	console.timeEnd('plotgrid')
	// console.log('alt::', altRows)
    return []
}
