class IntervalTreeNode {
	interval: [number, number];
	max: number;
	left: IntervalTreeNode | null;
	right: IntervalTreeNode | null;
	height: number;

	constructor(interval: [number, number]) {
		this.interval = interval;
		this.max = interval[1];
		this.left = null;
		this.right = null;
		this.height = 1; // Initial height of a new node is 1
	}
}

class IntervalTree {
	private root: IntervalTreeNode | null = null;
	private readonly BALANCE_THRESHOLD: number = 2; // Balance threshold

	insert(interval: [number, number]): void {

		this.root = this._insert(this.root, interval);
		if (this._needsRebuild()) {
			this.rebuild();
		}
	}

	private _insert(
		node: IntervalTreeNode | null,
		interval: [number, number],
	): IntervalTreeNode | null {
		if (node === null) {
			const newNode = new IntervalTreeNode(interval);

			return newNode;
		}
		let l = node.interval[0];


		if (this._doOverlap(interval, node.interval)) {
			console.log("OVERLAP---", interval, node.interval);
			return node;
		}

		if (interval[0] < l) {
			node.left = this._insert(node.left, interval);
		} else {
			node.right = this._insert(node.right, interval);
		}

		node.max = Math.max(node.max, interval[1]);

		// Update height and check balance
		node.height =
			1 + Math.max(this._height(node.left), this._height(node.right));

		return node;
	}

	private _height(node: IntervalTreeNode | null): number {
		return node ? node.height : 0;
	}

	private _balanceFactor(node: IntervalTreeNode | null): number {
		return node ? this._height(node.left) - this._height(node.right) : 0;
	}

	private _needsRebuild(): boolean {
		const balance = Math.abs(this._balanceFactor(this.root));
		// console.log("BALANCE---", balance, this.BALANCE_THRESHOLD);
		return balance > this.BALANCE_THRESHOLD;
	}

	rebuild(): void {
		if (!this.root) return;
		const nodes = this._collectNodes(this.root);
		this.root = this._buildBalanced(nodes, 0, nodes.length - 1);
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
		return interval1[0] <= interval2[1] && interval2[0] <= interval1[1];
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
