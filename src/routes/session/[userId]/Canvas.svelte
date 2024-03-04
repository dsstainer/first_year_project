<script lang="ts">
	import P5, { type p5 } from 'p5-svelte';

	// dimensions of canvas
	export let width: number;
	export let height: number;

	export let setGetImageBase64: Function;

	// ellipse, line, brush, etc
	let paintMode = '';
	// paint options
	let brushWidth = 10;
	let colour = '#000000';

	const sketch = (p5: p5) => {
		// the extra stuf on top of the image (like the ellipse, line or brush preview)
		let previewBuffer: any;
		// the actual image that has been drawn
		let buffer: any;

		setGetImageBase64(() => {
			return buffer.canvas.toDataURL();
		});

		p5.setup = () => {
			p5.createCanvas(width, height);
			buffer = p5.createGraphics(width, height);
			// image has white background initially
			buffer.background(255);
			// preview buffer has transparent background as it is an overlay
			previewBuffer = p5.createGraphics(width, height);
		};

		p5.draw = () => {
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
			if (paintMode == 'eraser') {
				previewBuffer.stroke(0);
				previewBuffer.strokeWeight(1);
				previewBuffer.noFill();
				previewBuffer.circle(p5.mouseX, p5.mouseY, brushWidth, brushWidth);
				if (p5.mouseIsPressed) {
					buffer.erase();
					buffer.strokeWeight(brushWidth);
					buffer.line(p5.pmouseX, p5.pmouseY, p5.mouseX, p5.mouseY);
					buffer.noErase();
				}
			}
			p5.clear();
			p5.image(buffer, 0, 0);
			p5.image(previewBuffer, 0, 0);
		};

		p5.mousePressed = () => {
			if (paintMode == 'fill') {
				let positions = [[Math.round(p5.mouseX), Math.round(p5.mouseY)]];
				for (let i = 0; i < 100; i++) {
					let position = positions[0];
					let targetColour = buffer.get(positions[0][0], positions[0][1]);
				}
			}
		};
	};
</script>

<P5 {sketch} />
<h3>main paint mode</h3>
<button
	on:click={() => {
		paintMode = 'pencil';
	}}
>
	pencil
</button>
<button
	on:click={() => {
		paintMode = 'eraser';
	}}
>
	eraser
</button>
<button
	on:click={() => {
		paintMode = 'ellipse';
	}}
>
	ellipse
</button>
<button
	on:click={() => {
		paintMode = 'fill';
	}}
>
	fill
</button>
<button
	on:click={() => {
		paintMode = 'line';
	}}
>
	line
</button>
<h3>extra painting settings</h3>
<p>for: {paintMode}</p>
<!-- width -->
{#if ['pencil', 'line', 'ellipse', 'eraser'].includes(paintMode)}
	<label for="bushwidth"
		>brush width
		<input type="range" id="brushwidth" bind:value={brushWidth} />
	</label>
{/if}
<!-- colour -->
{#if ['pencil', 'fill', 'ellipse'].includes(paintMode)}
	<label for="colour"
		>colour
		<input type="color" id="colour" bind:value={colour} />
	</label>
{/if}

<!-- some other extra setting -->
<!-- {#if ["brush", "..."].includes(paintMode)} -->
<!--   <label for="bushwidth">brush width</label> -->
<!--   <input type="range" id="brushwidth" bind:value={brushWidth}/> -->
<!-- {/if} -->
