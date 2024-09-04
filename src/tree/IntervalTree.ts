class IntervalTreeNode {
	interval: [number, number];
	max: number;
	left: IntervalTreeNode | null;
	right: IntervalTreeNode | null;
	height: number;
	subRowIndex: Set<number>;

	constructor(interval: [number, number], subRowIndex: number) {
		this.interval = interval;
		this.max = interval[1];
		this.left = null;
		this.right = null;
		this.height = 1; // Initial height of a new node is 1
		this.subRowIndex = new Set([subRowIndex]);
	}
}

class Interval {
	slots: [number, number];
	isDuplicate: boolean;
	inserted: boolean;
	constructor(slots: [number, number], isDuplicate: boolean) {
		this.slots = slots;
		this.isDuplicate = isDuplicate;
		this.inserted = false;
	}
}

class IntervalTree {
	private root: IntervalTreeNode | null = null;
	private readonly BALANCE_THRESHOLD: number = 2; // Balance threshold
	private mainRoot: IntervalTreeNode | null = null;

	insert(interval: [number, number], subRowIndex: number): [boolean, number] {
		const newInt = new Interval(interval, false);
		const [node, inserted, subIdx] = this._insert(
			this.mainRoot,
			newInt,
			subRowIndex
		);
		if (this.mainRoot === null) {
			this.mainRoot = node;
		}

		// this._setRoot(this.mainRoot);
		if (this._needsRebuild()) {
			this.rebuild();
		}
		return [inserted, subIdx];
	}

	// private _setRoot(node: IntervalTreeNode | null) {
	// 	this.root = node;
	// 	// console.log('ROOT', this.root)
	// 	// console.log('MAIN', this.mainRoot)
	// }

	private _insert(
		node: IntervalTreeNode | null,
		interval: Interval,
		subRowIndex: number
	): [IntervalTreeNode | null, boolean, number] {
		if (node === null) {
			if (interval.isDuplicate) {
				return [node, true, subRowIndex];
			}
			const newNode = new IntervalTreeNode(interval.slots, subRowIndex);
			// console.log("new node--", newNode);
			interval.inserted = true;
			return [newNode, true, subRowIndex];
		}

		const isDuplicate = this._isDuplicate(node.interval, interval.slots);
		if (isDuplicate) {
			interval.isDuplicate = true;
		}

		let l = node.interval[0];
		// console.log('NODE', node)
		// console.log('INTERVAL', interval)
		if (
			  node.subRowIndex.has(subRowIndex) &&
			this._doOverlap(interval.slots, node.interval)
		) {
			// console.log("OVERLAP---", interval, node.interval);
			// console.log("CLASH--");
			interval.inserted = false;
			return [node, false, subRowIndex];
		}

		// let inserted;

		if (isDuplicate) {
			[node.left, interval.inserted, subRowIndex] = this._insert(
				node.left,
				interval,
				subRowIndex
			);
			[node.right, interval.inserted, subRowIndex] = this._insert(
				node.right,
				interval,
				subRowIndex
			);
		}
		
		else if (interval.slots[0] < l) {
			
			[node.left, interval.inserted, subRowIndex] = this._insert(
				node.left,
				interval,
				subRowIndex
			);
		} else {
			[node.right, interval.inserted, subRowIndex] = this._insert(
				node.right,
				interval,
				subRowIndex
			);
		}

		node.max = Math.max(node.max, interval.slots[1]);

		// Update height and check balance
		node.height =
			1 + Math.max(this._height(node.left), this._height(node.right));

		if (this._isDuplicate(node.interval, interval.slots)) {
			// console.log('DUPE')
			node.subRowIndex.add(subRowIndex)
		}

		return [node, interval.inserted, subRowIndex];
	}

	private _height(node: IntervalTreeNode | null): number {
		return node ? node.height : 0;
	}

	private _balanceFactor(node: IntervalTreeNode | null): number {
		return node ? this._height(node.left) - this._height(node.right) : 0;
	}

	private _needsRebuild(): boolean {
		const balance = Math.abs(this._balanceFactor(this.mainRoot));
		// console.log("BALANCE---", balance, this.BALANCE_THRESHOLD);
		return balance > this.BALANCE_THRESHOLD;
	}

	rebuild(): void {
		if (!this.mainRoot) return;
		const nodes = this._collectNodes(this.mainRoot);
		this.mainRoot = this._buildBalanced(nodes, 0, nodes.length - 1);
	}

	getMainRoot(): IntervalTreeNode | null{
		return this.mainRoot
	}

	findNodeForTest(interval: [number, number]): IntervalTreeNode | undefined {
		const nodes = this._collectNodes(this.mainRoot);
		const res = nodes.find((node) => node.interval[0] === interval[0] && node.interval[1] === interval[1])
		return res
	}

	private _collectNodes(node: IntervalTreeNode | null): IntervalTreeNode[] {
		if (!node) return [];
		return [
			...this._collectNodes(node.left),
			node,
			...this._collectNodes(node.right),
		];
	}

	private _buildBalanced(
		nodes: IntervalTreeNode[],
		start: number,
		end: number
	): IntervalTreeNode | null {
		if (start > end) return null;
		const mid = Math.floor((start + end) / 2);
		const root = nodes[mid];
		root.left = this._buildBalanced(nodes, start, mid - 1);
		root.right = this._buildBalanced(nodes, mid + 1, end);
		root.max = Math.max(
			root.interval[1],
			Math.max(this._max(root.left), this._max(root.right))
		);
		root.height =
			1 + Math.max(this._height(root.left), this._height(root.right));
		return root;
	}

	private _max(node: IntervalTreeNode | null): number {
		return node ? node.max : -Infinity;
	}

	// overlapSearch(interval: [number, number]): [number, number][] {
	// 	const result: [number, number][] = [];
	// 	this._overlapSearch(this.root, interval, result);
	// 	return result;
	// }

	// private _overlapSearch(
	// 	node: ClashTreeNode | null,
	// 	interval: [number, number],
	// 	result: [number, number][]
	// ): void {
	// 	if (node === null) return;

	// 	if (this._doOverlap(node.interval, interval)) {
	// 		result.push(node.interval);
	// 	}

	// 	if (node.left !== null && node.left.max >= interval[0]) {
	// 		this._overlapSearch(node.left, interval, result);
	// 	}

	// 	if (node.right !== null && interval[1] >= node.interval[0]) {
	// 		this._overlapSearch(node.right, interval, result);
	// 	}
	// }

	private _doOverlap(
		interval1: [number, number],
		interval2: [number, number]
	): boolean {
		const interval1Start = interval1[0];
		const interval1End = interval1[1];
		const interval2Start = interval2[0];
		const interval2End = interval2[1];
		return (
			(interval1Start < interval2End && interval2Start < interval1End) ||
			(interval1Start === interval2Start && interval1End === interval2End) ||
			interval1Start === interval2Start ||
			interval1End === interval2End
		);
	}

	private _isDuplicate(
		interval1: [number, number],
		interval2: [number, number]
	): boolean {
		const interval1Start = interval1[0];
		const interval1End = interval1[1];
		const interval2Start = interval2[0];
		const interval2End = interval2[1];
		return interval1Start === interval2Start && interval1End === interval2End;
	}

	// private _doesClash(nodeParams, insertParams): boolean {

	//     // const {roomId, studentIds, staffId, resourceIds} = nodeParams;
	//     // const isSingleClash = insertParams.roomId === roomId || insertParams.staffId === staffId
	//     // const isClash2 = insertParams.studentIds.some(id => studentIds.has(id))
	//     // const clash3 = insertParams.resourceIds.some(id => resourceIds.has(id))
	//     // return isSingleClash || isClash2 || clash3
	//     return false
	// }
}

export default IntervalTree;
