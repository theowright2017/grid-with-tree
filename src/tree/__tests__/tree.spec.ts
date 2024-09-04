import IntervalTree from "../IntervalTree";

test("prevents insert", () => {
	const tree = new IntervalTree();
	tree.insert([1, 2], 1);
	tree.insert([3, 4], 1);
	tree.insert([5, 6], 1);
	tree.insert([7, 8], 1);
	const res = tree.insert([4, 7], 1);

	expect(res).toEqual([false, 1]);
});

test("prevents with 2 subs", () => {
	const tree = new IntervalTree();
	tree.insert([1, 2], 1);
	tree.insert([3, 4], 1);
	tree.insert([5, 6], 1);
	tree.insert([7, 8], 1);
	tree.insert([1, 2], 2);
	tree.insert([3, 4], 2);
	tree.insert([5, 6], 2);
	tree.insert([7, 8], 2);
	const res = tree.insert([4, 7], 2);
	expect(res).toEqual([false, 2]);
});

test("insert duplicate", () => {
	const tree = new IntervalTree();
	tree.insert([1, 5], 1);
	tree.insert([2, 3], 2);
	const res = tree.insert([1, 5], 2);
	const res2 = tree.insert([2, 3], 2);
	const res3 = tree.insert([0, 4], 2);
	const res4 = tree.insert([4, 5], 2);

	expect(res).toEqual([false, 2]);
	expect(tree.getMainRoot()?.subRowIndex.size).toBe(2);
	expect(res2).toEqual([false, 2]);
	expect(res3).toEqual([false, 2]);
	expect(res4).toEqual([false, 2]);
	expect(tree.findNodeForTest([1, 5])?.subRowIndex.size).toBe(2);
});

test("add list manually", () => {
	const tree = new IntervalTree();

	const list = [
		[28, 30],
		[20, 24],
		[22, 24], //
		[20, 24], //
		[22, 24], //
		[20, 24], //
		[20, 24], //
		[24, 26], //
		[28, 30], //
		[24, 25],
	];

	/*
        [
            [[28,30], [20,24], [24, 26]],
            [[22,24], [28,30], [24,25]],
            [[20,24]],
            [[22,24]],
            [[20,24]],
            [[20,24]]
        ]
    */

	const r1 = tree.insert([28, 30], 1);
	expect(r1).toEqual([true, 1]);
	const r2 = tree.insert([20, 24], 1);
	expect(r2).toEqual([true, 1]);
	const r3False = tree.insert([22, 24], 1);
	expect(r3False).toEqual([false, 1]);
	const r4 = tree.insert([22, 24], 2);
	expect(r4).toEqual([true, 2]);
	/*
        [
            [[28,30], [20,24], ],
            [[22,24],
        ]
    */
	const r21False1 = tree.insert([20, 24], 1);
	expect(r21False1).toEqual([false, 1]);
	const r21False2 = tree.insert([20, 24], 2);
	expect(r21False2).toEqual([false, 2]);
	const r21 = tree.insert([20, 24], 3);
	expect(r21).toEqual([true, 3]);

	const r22False1 = tree.insert([22, 24], 1);
	expect(r22False1).toEqual([false, 1]);
	const r22False2 = tree.insert([22, 24], 2);
	expect(r22False2).toEqual([false, 2]);
	const r22False3 = tree.insert([22, 24], 3);
	expect(r22False3).toEqual([false, 3]);
	const r22 = tree.insert([22, 24], 4);
	expect(r22).toEqual([true, 4]);
	/*
        [
            [[28,30], [20,24], ],
            [[22,24]],
            [[20,24]],
            [[22,24]],
        ]
    */
	const r23False1 = tree.insert([20, 24], 1);
	expect(r23False1).toEqual([false, 1]);
	const r23False2 = tree.insert([20, 24], 2);
	expect(r23False2).toEqual([false, 2]);
	const r23False3 = tree.insert([20, 24], 3);
	expect(r23False3).toEqual([false, 3]);
	const r23False4 = tree.insert([20, 24], 4);
	expect(r23False4).toEqual([false, 4]);
	const r23 = tree.insert([20, 24], 5);
	expect(r23).toEqual([true, 5]);

	const r24False1 = tree.insert([20, 24], 1);
	expect(r24False1).toEqual([false, 1]);
	const r24False2 = tree.insert([20, 24], 2);
	expect(r24False2).toEqual([false, 2]);
	const r24False3 = tree.insert([20, 24], 3);
	expect(r24False3).toEqual([false, 3]);
	const r24False4 = tree.insert([20, 24], 4);
	expect(r24False4).toEqual([false, 4]);
	const r24False5 = tree.insert([20, 24], 5);
	expect(r24False5).toEqual([false, 5]);
	const r24 = tree.insert([20, 24], 6);
	expect(r24).toEqual([true, 6]);
	/*
        [
            [[28,30], [20,24], ],
            [[22,24]],
            [[20,24]],
            [[22,24]],
            [[20,24]],
            [[20,24]]
        ]
    */
	const r26 = tree.insert([24, 26], 1);
	expect(r26).toEqual([true, 1]);

	const r27False1 = tree.insert([28, 30], 1);
	expect(r27False1).toEqual([false, 1]);
	const r27 = tree.insert([28, 30], 2);
	expect(r27).toEqual([true, 2]);

	const r28False1 = tree.insert([24, 25], 1);
	expect(r28False1).toEqual([false, 1]);
	const r28 = tree.insert([24, 25], 2);
	expect(r28).toEqual([true, 2]);
});

test("adds list correctly", () => {
	const tree = new IntervalTree();

	const list = [
		[28, 30],
		[20, 24],
		[22, 24],
		[20, 24],
		[22, 24],
		[20, 24],
		[20, 24],
		[24, 26],
		[28, 30],
		[24, 25],
	];

	/*
        [
            [[28,30], [20,24], [24, 26]],
            [[22,24], [28,30], [24,25]],
            [[20,24]],
            [[22,24]],
            [[20,24]],
            [[20,24]]
        ]

    */
	let altRows: [number, number][] = [];
	list.forEach(([startSlot, endSlot]) => {
		let hasInserted = false;
		let subRowIndex = 0;

		while (!hasInserted) {
			const [didInsert, subIdx] = tree.insert(
				[startSlot, endSlot],
				subRowIndex
			);
			if (didInsert) {
				hasInserted = true;
				if (!altRows[subIdx]) {
					altRows[subIdx] = [];
				}
				altRows[subIdx].push([startSlot, endSlot]);
			} else {
				subRowIndex = subIdx + 1;
			}
		}
	});
	console.log(altRows);
	expect(altRows.length).toEqual(6);
});
