<template>
    <NuxtLayout>
      <div class="p-6 max-w-4xl mx-auto text-white">
        <h1 class="text-3xl font-bold mb-6">Submit Your Work</h1>
  
        <div class="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 shadow mb-8">
          <h2 class="text-2xl font-semibold text-indigo-300 mb-2">
            {{ quest.title }}
          </h2>
          <p class="mb-4 text-gray-300">{{ quest.description }}</p>
  
          <div class="mb-2">
            <span class="font-semibold">Bounty: </span>
            <span class="text-green-400"> {{ quest.bounty }} ETH</span>
          </div>
  
          <div>
            <span class="font-semibold">Status: </span>
            <span class="text-yellow-300 capitalize"> {{ quest.status }}</span>
          </div>
        </div>
  
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block mb-1 text-sm font-medium text-white">Submission Link</label>
            <input
              v-model="submission.link"
              type="url"
              required
              placeholder="https://github.com/your-pr"
              class="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
  
          <div>
            <label class="block mb-1 text-sm font-medium text-white">Comments (optional)</label>
            <textarea
              v-model="submission.comment"
              rows="4"
              placeholder="Tell us anything important about your submission..."
              class="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
  
          <div>
            <button
              type="submit"
              class="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded"
            >
              Submit Work
            </button>
          </div>
        </form>
      </div>
    </NuxtLayout>
  </template>
  
  <script setup lang="ts">
  const route = useRoute();
  
  const quest = {
    id: route.params.id,
    title: "Fix the TypeScript Types in API Client",
    description:
      "We need help cleaning up and strongly typing our API client for better DX and refactoring safety.",
    bounty: 0.1,
    status: "open",
  };
  
  const submission = reactive({
    link: "",
    comment: "",
  });
  
  function handleSubmit() {
    console.log("Submitting:", submission);
  
    // You could call an API here, for example:
    // await $fetch(`/api/quests/${quest.id}/submit`, {
    //   method: "POST",
    //   body: submission,
    // });
  
    alert("Submission received! (This is just a placeholder)");
  }
  </script>
  
  <style scoped></style>
  