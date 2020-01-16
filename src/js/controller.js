const SIDE = 50;
const HEIGHT = Math.sqrt(3) * SIDE;
const WIDTH = 2 * SIDE;

export default class Controller {

	constructor() {
		this.animAmt = 0;
		this.period = 9;
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
		this.renderHexes(context);
	}

	/**
	 * @param {!CanvasRenderingContext2D} context
	 */
	renderHexes(context) {
		const halfLayers = 5;
		for (let y = -halfLayers; y <= halfLayers; y++) {
			for (let x = -halfLayers; x <= halfLayers; x++) {
				var adjustedX = y % 2 == 0 ? x + 0.5 : x;
				this.renderHex(
					context,
					{
						x: WIDTH * adjustedX,
						y: HEIGHT * y
					}
				);
			}
		}
	}

	/**
	 * @param {!CanvasRenderingContext2D} context
	 */
	renderHex(context, center) {
		context.beginPath();
		for (let i = 0; i < 6; i++) {
			const amt = i / 6;
			const angle = 2 * Math.PI * amt;
			const x = center.x + SIDE * Math.cos(angle);
			const y = center.y + SIDE * Math.sin(angle);
			if (i == 0) {
				context.moveTo(x, y);
			}
			else {
				context.lineTo(x, y);
			}
		}
		context.closePath();
		context.fill();
	}

}
