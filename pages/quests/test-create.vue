<template>
  <div class="max-w-xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-md border">
    <h1 class="text-3xl font-semibold text-gray-800 mb-6">Create a Quest</h1>

    <form @submit.prevent="submitQuest" class="space-y-5">
      <div>
        <label for="questId" class="block text-sm font-medium text-gray-700"
          >Quest ID</label
        >
        <input
          v-model="quest.questId"
          id="questId"
          type="text"
          class="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label for="title" class="block text-sm font-medium text-gray-700"
          >Title</label
        >
        <input
          v-model="quest.title"
          id="title"
          type="text"
          class="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700"
          >Description</label
        >
        <textarea
          v-model="quest.description"
          id="description"
          rows="3"
          class="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      <div>
        <label for="status" class="block text-sm font-medium text-gray-700"
          >Status</label
        >
        <select
          v-model="quest.status"
          id="status"
          class="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select status</option>
          <option value="NotStarted">Not Started</option>
          <option value="InProgress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <button
        type="submit"
        class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
      >
        Submit Quest
      </button>
    </form>

    <div v-if="response" class="mt-6 text-green-600 font-medium">
      {{ response }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";


// import { useAuth0 } from '@auth0/auth0-vue';

// const { getAccessTokenSilently, user } = useAuth0();

// const accessToken = await getAccessTokenSilently();
// const userId = user.value?.sub; // e.g., "auth0|abc123"

// await fetch(`https://api.devirl.com/auth/session/${userId}`, {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'text/plain',
//   },
//   body: accessToken, // or a signed session token if you generate one
//   credentials: 'include', // send cookies if needed
// });


const { data: user } = await useFetch("/api/auth/session", {
  credentials: "include",
});

const quest = ref({
  userId: "",
  questId: "",
  title: "",
  description: "",
  status: "",
});

const response = ref("");

const submitQuest = async () => {
  if (!user.value) {
    response.value = "Please log in to create a quest.";
    return;
  }

  try {
    const payload = {
      userId: user.value?.sub || "",
      questId: quest.value.questId,
      title: quest.value.title,
      description: quest.value.description || undefined,
      status: quest.value.status || undefined,
    };

    const res = await fetch(
      "https://api.devirl.com/dev-quest-service/quest/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    response.value = "Quest created successfully!";
  } catch (err: any) {
    response.value = `Error: ${err.message}`;
  }
};
</script>
