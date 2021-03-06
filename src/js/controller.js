import { easeInOut, slurp, loop } from './util';

const SIDE = 35;
const HEIGHT = Math.sqrt(3) * SIDE;
const WIDTH = 2 * SIDE;
const CANVAS_SIZE = 500 * 2;

export default class Controller {

	constructor() {
		this.animAmt = 0;
		this.period = 8;
	}

	/**
	 * Simulate time passing.
	 *
	 * @param {number} dt Time since the last frame, in seconds 
	 */
	update(dt) {
		this.animAmt += dt / this.period;
		this.animAmt %= 1;
	}

	/**
	 * Render the current state of the controller.
	 *
	 * @param {!CanvasRenderingContext2D} context
	 */
	render(context) {
		const animState = Math.floor(this.animAmt * 2);
		const animAmt = (this.animAmt * 2) % 1;

		const splodeAmt = easeInOut(loop(animAmt), 4); 
		const rotateAmt = easeInOut(animAmt, 3);

		if (animState == 0) {
			context.fillStyle = 'white';
			context.fillRect(-CANVAS_SIZE, -CANVAS_SIZE, 2 * CANVAS_SIZE, 2 * CANVAS_SIZE);
			context.fillStyle = 'black';
			this.renderHexes(context, splodeAmt, 2 * rotateAmt);
		}
		else {
			context.fillStyle = 'black';
			context.fillRect(-CANVAS_SIZE, -CANVAS_SIZE, 2 * CANVAS_SIZE, 2 * CANVAS_SIZE);
			context.fillStyle = 'white';
			this.renderStars(context, splodeAmt, rotateAmt);
		}
	}

	/**
	 * @param {!CanvasRenderingContext2D} context
	 */
	renderHexes(context, splodeAmt, rotateAmt) {
		const halfLayers = 5;
		for (let y = -halfLayers; y <= halfLayers; y++) {
			for (let x = -halfLayers; x <= halfLayers; x++) {
				var adjustedX = y % 2 == 0 ? x : x + 0.5;
				if (y % 2 == 0) {
					if (x % 3 == 0) {
						continue;
					}
				}
				else {
					if ((x + 2) % 3 == 0) {
						continue;
					}
				}
				this.renderHex(
					context,
					{
						x: WIDTH * adjustedX,
						y: HEIGHT * y
					},
					splodeAmt,
					2 * Math.PI * rotateAmt / 6
				);
			}
		}
	}

	renderStars(context, splodeAmt, rotateAmt) {
		const halfLayers = 5;
		for (let y = -halfLayers; y <= halfLayers; y++) {
			for (let x = -halfLayers; x <= halfLayers; x++) {
				var adjustedX = y % 2 == 0 ? x : x + 0.5;
				this.renderStar(
					context,
					{
						x: 3 * WIDTH * adjustedX,
						y: HEIGHT * y
					},
					splodeAmt,
					-2 * Math.PI * rotateAmt / 6
				);
			}
		}
	}

	/**
	 * @param {!CanvasRenderingContext2D} context
	 */
	renderHex(context, center, splodeAmt, rotation) {
		const splode = getSplode(center, splodeAmt)
		context.save();
		context.translate(splode * center.x, splode * center.y);
		context.rotate(rotation);
		context.beginPath();
		for (let i = 0; i < 6; i++) {
			const amt = i / 6;
			const angle = 2 * Math.PI * amt;
			const x = SIDE * Math.cos(angle);
			const y = SIDE * Math.sin(angle);
			if (i == 0) {
				context.moveTo(x, y);
			}
			else {
				context.lineTo(x, y);
			}
		}
		context.closePath();
		context.fill();
		context.restore();
	}

	renderStar(context, center, splodeAmt, rotation) {
		const splode = getSplode(center, splodeAmt)
		context.save();
		context.translate(splode * center.x, splode * center.y);
		context.rotate(rotation);
		context.beginPath();
		for (let i = 0; i < 12; i++) {
			const amt = i / 12;
			const angle = 2 * Math.PI * amt;
			const radius = i % 2 == 0 ? SIDE : Math.sqrt(3) * SIDE;
			const x = radius * Math.cos(angle);
			const y = radius * Math.sin(angle);
			if (i == 0) {
				context.moveTo(x, y);
			}
			else {
				context.lineTo(x, y);
			}
		}
		context.closePath();
		context.fill();
		context.restore();
	}

}

function getSplode(center, splodeAmt) {
	const dist = sqMagnitude(center);
	const distAmt = 1 - dist / (500 * 500);
	const adjustedSplodeAmt = Math.pow(splodeAmt, 1 * distAmt);
	return slurp(1, 1.2, adjustedSplodeAmt);
}


function sqMagnitude(p) {
	return p.x * p.x + p.y * p.y;
}