<script lang="ts">
	import { createQuery } from "@tanstack/svelte-query";
	import { orpc } from "$lib/api/client";

	const query = createQuery(() =>
		orpc.clusters.queryOptions({
			input: {
				k: 5,
				maxIterations: 20,
				force: true
			}
		})
	);
</script>

<h1>2dv515 Assignment 2</h1>
<button on:click={() => query.refetch()} class="mb-4!">Refetch</button>

{#if query.isLoading}
	<p>Loading...</p>
{:else if query.isSuccess}
	<div class="grid grid-cols-3! gap-4!">
		{#each query.data as cluster}
			<ul>
				<h2>Cluster {cluster.id}</h2>

				{#each cluster.assignments as assignment}
					<li class="list-none!">{assignment},</li>
				{/each}
			</ul>
		{/each}
	</div>
{:else if query.isError}
	<p>{query.error?.message}</p>
{/if}
