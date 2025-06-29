<script setup lang="ts">
</script>

<template>
  <NuxtLayout>
    <div class="font-sans text-white bg-black">
      <!-- Hero Section -->
      <div class="py-32 px-6">
        <div class="max-w-3xl mx-auto text-center space-y-6">
          <h1 class="font-heading text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Welcome to <span class="text-teal-400">Dev IRL</span>
          </h1>
          <p class="text-lg md:text-xl text-gray-300 leading-relaxed">
            A platform where developers complete real-world coding quests, earn XP, and rise through the ranks. Built
            for skill-building, reputation, and community.
          </p>
        </div>
      </div>

      <!-- How It Works Section -->
      <div class="bg-teal-500 text-black py-20 px-6">
        <div class="max-w-4xl mx-auto space-y-12">
          <div class="border-l-2 border-black/30 pl-6 space-y-12">
            <div>
              <h3 class="text-3xl font-heading font-semibold mb-2">Explore Quests</h3>
              <p class="text-black/80 leading-relaxed">
                Clients post real-world development quests. Browse the board and pick a challenge that suits your skills.
              </p>
            </div>
            <div>
              <h3 class="text-3xl font-heading font-semibold mb-2">Complete & Submit</h3>
              <p class="text-black/80 leading-relaxed">
                Claim the quest, write your code, and submit your solution. If accepted, the client pays out and you earn XP.
              </p>
            </div>
            <div>
              <h3 class="text-3xl font-heading font-semibold mb-2">Earn XP & Rank Up</h3>
              <p class="text-black/80 leading-relaxed">
                Completing quests increases your rank. Show off your progression and unlock access to higher-tier quests.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Community & Reputation Section -->
      <div class="bg-zinc-800 py-16 px-6">
        <div class="max-w-5xl mx-auto text-center space-y-10">
          <h2 class="font-heading text-3xl md:text-4xl font-bold text-teal-400">
            Reputation Matters
          </h2>
          <p class="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Dev IRL is a community built on trust, accountability, and mutual respect.
            Both developers and clients earn reputation through their actions and that reputation shapes your standing.
          </p>

          <div class="grid md:grid-cols-3 gap-8 text-left">
            <div class="bg-zinc-950 p-6 rounded-2xl shadow">
              <h3 class="font-heading text-xl font-semibold mb-2">Build Reputation</h3>
              <p>Complete quests, communicate clearly, and deliver great work to earn positive feedback and XP.</p>
            </div>
            <div class="bg-zinc-950 p-6 rounded-2xl shadow">
              <h3 class="font-heading text-xl font-semibold mb-2">Transparent Feedback</h3>
              <p>Clients and developers can leave ratings and comments after each quest. This helps everyone choose who to work with.</p>
            </div>
            <div class="bg-zinc-950 p-6 rounded-2xl shadow">
              <h3 class="font-heading text-xl font-semibold mb-2">Guarding the Community</h3>
              <p>Measures will be taken against repeated bad faith actions.</p>
            </div>
          </div>

          <p class="text-lg text-gray-300 max-w-2xl mx-auto pt-8 leading-relaxed">
            We're building more than a platform — we're building a community. Every quest you complete, every review you give, and every interaction you have helps shape Dev IRL into a space where great developers and great clients thrive together.
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
