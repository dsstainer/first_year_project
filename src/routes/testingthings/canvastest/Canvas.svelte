<script lang="ts">
	import P5 from 'p5-svelte';

	export let width: number;
	export let height: number;

	let paintMode = '';
  let brushWidth = 10;
  let colour = "#000000"

	const sketch = (p5: any) => {
		p5.setup = () => {
			p5.createCanvas(width, height);
			p5.background(255);
		};

		p5.draw = () => {
			if (paintMode == 'brush') {
				if (p5.mouseIsPressed) {
					p5.stroke(colour);
					p5.strokeWeight(brushWidth);
					p5.line(p5.pmouseX, p5.pmouseY, p5.mouseX, p5.mouseY);
				}
			}
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
{#if ["brush", "line", "ellipse"].includes(paintMode)}
  <label for="bushwidth">brush width</label>
  <input type="range" id="brushwidth" bind:value={brushWidth}/>
{/if}
<!-- colour -->
{#if ["brush", "fill"].includes(paintMode)}
  <label for="colour">colour</label>
  <input type="color" id="colour" bind:value={colour}/>
{/if}
<!-- some other extra setting -->
<!-- {#if ["brush", "..."].includes(paintMode)} -->
<!--   <label for="bushwidth">brush width</label> -->
<!--   <input type="range" id="brushwidth" bind:value={brushWidth}/> -->
<!-- {/if} -->
