<script lang="ts">
	import P5, { type p5 } from 'p5-svelte';

	// dimensions of canvas
	export let width: number;
	export let height: number;

	export let setGetImageBase64: Function;

	// ellipse, line, brush, etc
	let paintMode = 'brush';
	// paint options
	let brushWidth = 10;
	let colour = '#000000';

	const sketch = (p5: p5) => {
		// the extra stuf on top of the image (like the ellipse, line or brush preview)
		let previewBuffer: any;
		// the actual image that has been drawn
		let buffer: any;

		let bgColour = p5.color(255);

		let shapeOriginX: number | undefined;
		let shapeOriginY: number | undefined;

		setGetImageBase64(() => {
			return buffer.canvas.toDataURL();
		});

		p5.setup = () => {
			p5.createCanvas(width, height);
			// p5.pixelDensity(1);
			buffer = p5.createGraphics(width, height);

			buffer.background(bgColour);
			// preview buffer has transparent background as it is an overlay
			previewBuffer = p5.createGraphics(width, height);
		};

		p5.draw = () => {
			// previewBuffer.reset();
			// previewBuffer.erase();
			// previewBuffer.rect(0, 0, previewBuffer.width, previewBuffer.height);
			// previewBuffer.noErase();
			// p5.image(previewBuffer, 0, 0);
			previewBuffer.clear();

			if (paintMode == 'pencil') {
				previewBuffer.stroke(colour);
				previewBuffer.strokeWeight(brushWidth);
				previewBuffer.point(p5.mouseX, p5.mouseY);
				if (p5.mouseIsPressed) {
					buffer.stroke(colour);
					buffer.strokeWeight(brushWidth);
					buffer.line(p5.pmouseX, p5.pmouseY, p5.mouseX, p5.mouseY);
				}
			}
			if (paintMode == 'line' && shapeOriginX != undefined && shapeOriginY != undefined) {
				previewBuffer.stroke(colour);
				previewBuffer.strokeWeight(brushWidth);
				previewBuffer.line(shapeOriginX, shapeOriginY, p5.mouseX, p5.mouseY);
			}
			if (paintMode == 'rectangle' && shapeOriginX != undefined && shapeOriginY != undefined) {
				previewBuffer.stroke(colour);
				previewBuffer.strokeWeight(brushWidth);
				previewBuffer.noFill();
				previewBuffer.rect(
					shapeOriginX,
					shapeOriginY,
					p5.mouseX - shapeOriginX,
					p5.mouseY - shapeOriginY
				);
			}
			if (paintMode == 'ellipse' && shapeOriginX != undefined && shapeOriginY != undefined) {
				previewBuffer.stroke(colour);
				previewBuffer.strokeWeight(brushWidth);
				previewBuffer.noFill();
				previewBuffer.ellipse(
					(shapeOriginX + p5.mouseX) / 2,
					(shapeOriginY + p5.mouseY) / 2,
					p5.mouseX - shapeOriginX,
					p5.mouseY - shapeOriginY
				);
			}
			if (paintMode == 'eraser') {
				previewBuffer.stroke(0);
				previewBuffer.strokeWeight(1);
				previewBuffer.noFill();
				previewBuffer.circle(p5.mouseX, p5.mouseY, brushWidth, brushWidth);
				if (p5.mouseIsPressed) {
					buffer.stroke(bgColour);
					buffer.strokeWeight(brushWidth);
					buffer.line(p5.pmouseX, p5.pmouseY, p5.mouseX, p5.mouseY);
				}
			}
			// p5.noSmooth();
			p5.clear();
			// p5.background(255);
			p5.image(buffer, 0, 0);
			p5.image(previewBuffer, 0, 0);
		};

		p5.keyPressed = () => {
			if (p5.keyCode == p5.ESCAPE) {
				shapeOriginX = undefined;
				shapeOriginY = undefined;
			}
		};

		p5.mouseReleased = () => {
			if (paintMode == 'line' && shapeOriginX != undefined && shapeOriginY != undefined) {
				buffer.stroke(colour);
				buffer.strokeWeight(brushWidth);
				// buffer.noFill();
				buffer.line(shapeOriginX, shapeOriginY, p5.mouseX, p5.mouseY);
				shapeOriginX = undefined;
				shapeOriginY = undefined;
			}
			if (paintMode == 'ellipse' && shapeOriginX != undefined && shapeOriginY != undefined) {
				buffer.stroke(colour);
				buffer.strokeWeight(brushWidth);
				buffer.noFill();
				buffer.ellipse(
					(shapeOriginX + p5.mouseX) / 2,
					(shapeOriginY + p5.mouseY) / 2,
					p5.mouseX - shapeOriginX,
					p5.mouseY - shapeOriginY
				);
				shapeOriginX = undefined;
				shapeOriginY = undefined;
			}
			if (paintMode == 'rectangle' && shapeOriginX != undefined && shapeOriginY != undefined) {
				buffer.stroke(colour);
				buffer.strokeWeight(brushWidth);
				buffer.noFill();
				buffer.rect(shapeOriginX, shapeOriginY, p5.mouseX - shapeOriginX, p5.mouseY - shapeOriginY);
				shapeOriginX = undefined;
				shapeOriginY = undefined;
			}
		};

		p5.mousePressed = () => {
			if (paintMode == 'line') {
				shapeOriginX = p5.mouseX;
				shapeOriginY = p5.mouseY;
			}
			if (paintMode == 'ellipse') {
				shapeOriginX = p5.mouseX;
				shapeOriginY = p5.mouseY;
			}
			if (paintMode == 'rectangle') {
				shapeOriginX = p5.mouseX;
				shapeOriginY = p5.mouseY;
			}
			if (
				paintMode == 'fill' &&
				!(p5.mouseX < 0 || p5.mouseY < 0 || p5.mouseX >= buffer.width || p5.mouseY >= buffer.height)
			) {
				const tolerance = 5;
				buffer.loadPixels();
				let position = Math.floor(p5.mouseY) * buffer.width + Math.floor(p5.mouseX);
				let originR = buffer.pixels[position * 4];
				let originG = buffer.pixels[position * 4 + 1];
				let originB = buffer.pixels[position * 4 + 2];
				let originA = buffer.pixels[position * 4 + 3];
				let positions = [position];
				let filledPositions = new Set();
				let colourp5 = p5.color(colour);
				for (let i = 0; i < 100 * buffer.width * buffer.height; i++) {
					let position = positions.shift();
					if (position == undefined) {
						break;
					}
					if (
						position % buffer.width == 0 ||
						position % buffer.width == buffer.width - 1 ||
						position < buffer.width ||
						position >= (buffer.height - 1) * buffer.width
					) {
						continue;
					}
					if (filledPositions.has(position)) {
						continue;
					}
					let r = buffer.pixels[position * 4];
					let g = buffer.pixels[position * 4 + 1];
					let b = buffer.pixels[position * 4 + 2];
					let a = buffer.pixels[position * 4 + 3];
					const rDiff = r - originR;
					const gDiff = g - originG;
					const bDiff = b - originB;
					const aDiff = a - originA;

					if (
						!(
							Math.abs(rDiff) <= tolerance &&
							Math.abs(gDiff) <= tolerance &&
							Math.abs(bDiff) <= tolerance &&
							Math.abs(aDiff) <= tolerance
						)
					) {
						continue;
					}
					buffer.set(position % buffer.width, Math.floor(position / buffer.width), colourp5);
					positions.push(position - 1);
					positions.push(position + 1);
					positions.push(position - buffer.width);
					positions.push(position + buffer.width);
					filledPositions.add(position);
				}
				buffer.updatePixels();
			}
		};
	};
</script>

<div class="canvas-container">
	<div class="paint-mode">
		<label class="paint-mode-radio-button">
			<input bind:group={paintMode} type="radio" name="paintMode" value="pencil" /> pencil
		</label>
		<br />
		<label class="paint-mode-radio-button">
			<input bind:group={paintMode} type="radio" name="paintMode" value="eraser" /> eraser
		</label>
		<br />
		<label class="paint-mode-radio-button">
			<input bind:group={paintMode} type="radio" name="paintMode" value="line" /> line
		</label>
		<br />
		<label class="paint-mode-radio-button">
			<input bind:group={paintMode} type="radio" name="paintMode" value="fill" /> fill
		</label>
		<br />
		<label class="paint-mode-radio-button">
			<input bind:group={paintMode} type="radio" name="paintMode" value="ellipse" /> ellipse
		</label>
		<br />
		<label class="paint-mode-radio-button">
			<input bind:group={paintMode} type="radio" name="paintMode" value="rectangle" /> rectangle
		</label>
	</div>

	<div class="sktech">
		<P5 {sketch} />
	</div>

	<div class="paint-options">
		{#if ['pencil', 'line', 'ellipse', 'eraser', 'rectangle'].includes(paintMode)}
			<label for="bushwidth"
				>brush width
				<br />
				<input type="range" id="brushwidth" bind:value={brushWidth} />
			</label>
			<br />
		{/if}
		{#if ['pencil', 'fill', 'ellipse', 'line', 'rectangle'].includes(paintMode)}
			<label for="colour"
				>colour
				<br />
				<input type="color" id="colour" bind:value={colour} />
			</label>
			<br />
		{/if}
	</div>
</div>

<style>
	.canvas-container {
		display: flex;
		/* flex-flow: row; */
	}
	.paint-mode,
	.paint-options {
		flex: 1 1 auto;
		width: 200px;
		padding: 10px;
	}

	.paint-mode-radio-button {
		display: inline-block;
		padding: 8px 16px;
		background-color: #f0f0f0;
		border: 1px solid #ccc;
		border-radius: 4px;
		cursor: pointer;
	}

	.paint-mode-radio-button:hover {
		background-color: #e0e0e0;
	}

	.paint-mode-radio-button > input[type='radio'] {
		display: none;
	}

	.paint-mode-radio-button > input[type='radio']:checked + label {
		background-color: #007bff;
		color: #fff;
	}

	.paint-options > * > * {
		width: 150px;
	}
</style>
