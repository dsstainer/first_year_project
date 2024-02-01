<script lang="ts">
	import P5 from 'p5-svelte';

	export let width: number;
	export let height: number;

	let paintMode = '';
	let brushWidth = 10;
	let colour = '#000000';

	const sketch = (p5: any) => {
		let previewBuffer: any;
		let buffer: any;
		p5.setup = () => {
			p5.createCanvas(width, height);
			buffer = p5.createGraphics(width, height);
			buffer.background(255);
			previewBuffer = p5.createGraphics(width, height);
		};

		p5.draw = () => {
			previewBuffer.clear();
			if (paintMode == 'brush') {
				previewBuffer.stroke(colour);
				previewBuffer.strokeWeight(brushWidth);
				previewBuffer.point(p5.mouseX, p5.mouseY);
				if (p5.mouseIsPressed) {
					buffer.stroke(colour);
					buffer.strokeWeight(brushWidth);
					buffer.line(p5.pmouseX, p5.pmouseY, p5.mouseX, p5.mouseY);
				}
			}
			p5.image(buffer, 0, 0);
			p5.image(previewBuffer, 0, 0);
		};
	};
</script>

<P5 {sketch} />
<h3>main paint mode</h3>
<button
	on:click={() => {
		paintMode = 'brush';
	}}
>
	line
</button>
<h3>extra painting settings</h3>
<!-- brush width -->
{#if ['brush', 'line', 'ellipse'].includes(paintMode)}
	<label for="bushwidth">brush width</label>
	<input type="range" id="brushwidth" bind:value={brushWidth} />
{/if}
<!-- colour -->
{#if ['brush', 'fill'].includes(paintMode)}
	<label for="colour">colour</label>
	<input type="color" id="colour" bind:value={colour} />
{/if}

<!-- some other extra setting -->
<!-- {#if ["brush", "..."].includes(paintMode)} -->
<!--   <label for="bushwidth">brush width</label> -->
<!--   <input type="range" id="brushwidth" bind:value={brushWidth}/> -->
<!-- {/if} -->
