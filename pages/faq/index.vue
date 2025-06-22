<template>
  <NuxtLayout>
    <div class="mx-auto max-w-3xl px-6 py-12 text-white">
      <h1 class="text-3xl font-bold mb-8">Frequently Asked Questions</h1>

      <div class="space-y-4">
        <details class="group rounded border border-zinc-700 bg-zinc-900 px-4 py-3 open:bg-zinc-800 transition">
          <summary class="cursor-pointer font-medium text-lg marker:hidden group-open:mb-2">
            About
          </summary>
          <p class="text-zinc-300">
            Dev IRL is a platform where developers complete real-world "quests" to learn, grow, and get noticed. Think of it as RPG-style coding for real-world impact.
          </p>
        </details>

        <details class="group rounded border border-zinc-700 bg-zinc-900 px-4 py-3 open:bg-zinc-800 transition">
          <summary class="cursor-pointer font-medium text-lg marker:hidden group-open:mb-2">
           Quest Creation
          </summary>
          <p class="text-zinc-300">
            Click "Create Quest", fill in the required fields, and submit. It’ll go live and people can estimate and leave comments.
          </p>
        </details>

        <details class="group rounded border border-zinc-700 bg-zinc-900 px-4 py-3 open:bg-zinc-800 transition">
          <summary class="cursor-pointer font-medium text-lg marker:hidden group-open:mb-2">
            Ranks
          </summary>
          <p class="text-zinc-300">
            Ranks range from Bronze to Aether to indicate difficulty — Bronze being beginner-friendly, and Aether being elite-level challenges.
          </p>
        </details>
      </div>
    </div>
  </NuxtLayout>
</template>
