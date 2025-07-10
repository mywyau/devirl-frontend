<script setup lang="ts">
</script>

<template>
  <NuxtLayout>
    <div class="font-sans text-white bg-black">
      <!-- Hero Section -->
      <div class="py-32 px-6">
        <div class="max-w-3xl mx-auto text-center space-y-6">
          <h1 class="font-heading text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Welcome to <span class="font-sans text-teal-400">Dev IRL</span>
          </h1>
          <p class="text-lg md:text-xl text-gray-300 leading-relaxed">
            A space where devs take on real coding quests, grow their skills, and level up — while clients get great work done by passionate people.
          </p>
        </div>
      </div>

      <!-- Developer Workflow Section -->
      <section class="bg-teal-500 text-black py-20 px-6">
        <div class="max-w-5xl mx-auto space-y-10">
          <p class="text-center text-black/80 max-w-3xl mx-auto">
            Tired of toy problems? Here, you can solve real ones — and get XP, feedback, and cool rewards for your work.
          </p>

          <div class="grid md:grid-cols-3 gap-10 mt-12">
            <div>
              <h3 class="text-2xl font-semibold mb-2">Pick a Quest</h3>
              <p>Scroll the board, find something interesting, and accept the challenge. No gatekeeping — just code and go.</p>
            </div>
            <div>
              <h3 class="text-2xl font-semibold mb-2">Do Your Thing</h3>
              <p>Write great code, submit your solution, and earn XP. Clients and fellow devs can give helpful feedback too.</p>
            </div>
            <div>
              <h3 class="text-2xl font-semibold mb-2">Level Up</h3>
              <p>Every quest earns you XP and boosts your rank. The better you do, the more cool quests you'll unlock.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Client Value Section -->
      <section class="bg-white text-black py-20 px-6">
        <div class="max-w-5xl mx-auto space-y-10">
          <p class="text-center text-gray-700 max-w-3xl mx-auto">
            Got a feature you’ve been putting off? A bug you can’t squash? Let the community handle it — fast, fun, and with full transparency.
          </p>

          <div class="grid md:grid-cols-3 gap-10 mt-12">
            <div>
              <h3 class="text-2xl font-semibold mb-2">Post a Quest</h3>
              <p>Describe what you need built (or fixed). Devs will estimate effort and difficulty so you know what to expect.</p>
            </div>
            <div>
              <h3 class="text-2xl font-semibold mb-2">Review & Reward</h3>
              <p>Get working code, review submissions, and choose the best. Only pay when it’s right. Simple.</p>
            </div>
            <div>
              <h3 class="text-2xl font-semibold mb-2">Earn Trust</h3>
              <p>Give clear feedback, reward good work, and build a solid rep. Great clients attract great devs.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Reputation & Community Section -->
      <div class="bg-zinc-800 py-16 px-6">
        <div class="max-w-5xl mx-auto text-center space-y-10">
          <h2 class="font-heading text-3xl md:text-4xl font-bold text-teal-400">
            Built on Trust, Fueled by Fun
          </h2>
          <p class="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Dev IRL isn’t just a place to get things done — it’s a community of helpful humans, curious coders, and cool clients.
          </p>

          <div class="grid md:grid-cols-3 gap-8 text-left">
            <div class="bg-zinc-950 p-6 rounded-2xl shadow">
              <h3 class="font-heading text-xl font-semibold mb-2">Reputation Counts</h3>
              <p>Do good work. Be kind. Help others. Whether you’re a dev or a client, your actions shape how people see you.</p>
            </div>
            <div class="bg-zinc-950 p-6 rounded-2xl shadow">
              <h3 class="font-heading text-xl font-semibold mb-2">No Surprises</h3>
              <p>Every quest has estimates from multiple devs — so you’re not flying blind. Transparent, fair, and helpful.</p>
            </div>
            <div class="bg-zinc-950 p-6 rounded-2xl shadow">
              <h3 class="font-heading text-xl font-semibold mb-2">Good Vibes Only</h3>
              <p>We don’t tolerate bad actors. Respect, honesty, and good communication are the default here.</p>
            </div>
          </div>

          <p class="text-lg text-gray-300 max-w-2xl mx-auto pt-8 leading-relaxed">
            Let’s build something better — together. Whether you’re shipping code or shaping ideas, you belong here.
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
