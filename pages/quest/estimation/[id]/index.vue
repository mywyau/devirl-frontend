<script setup lang="ts">
import { ref } from "vue";

const questId = "abc123";
const questTitle = "Implement OAuth Login Flow";
const questDescription =
    "Set up secure OAuth login using Auth0 and integrate it with the backend session system.";

const level = ref<string | null>(null);
const notes = ref("");

const levelOptions = [
    { value: "Bronze", label: "Bronze" },
    { value: "Iron", label: "Iron" },
    { value: "Steel", label: "Steel" },
    { value: "Mithril", label: "Mithril" },
    { value: "Adamantite", label: "Adamantite" },
];


const pastEstimates = [
    { user: "dev_rogue", level: "Bronze", notes: "Some edge cases, moderate effort." },
    { user: "senior_mage", level: "Mithril", notes: "Security concerns, needs testing." },
    { user: "code_knight", level: "Adamantite", notes: "Straightforward with Auth0 SDK." },
];

function submitEstimation() {
    if (!level.value) return;
    const selected = levelOptions.find((opt) => opt.value === level.value);
    console.log("Submitting estimation:", {
        questId,
        level: selected?.value,
        label: selected?.label,
        notes: notes.value,
    });
    // Send this payload to your backend
}

</script>

<template>
    <NuxtLayout>
        <div class="max-w-3xl mx-auto py-12 px-6 text-white">
            <h1 class="text-3xl font-bold mb-4">Estimate Quest Difficulty</h1>

            <!-- Quest Details -->
            <div class="bg-teal-300/70 p-6 rounded-xl mb-6">
                <h2 class="text-black text-xl font-semibold">{{ questTitle }}</h2>
                <p class="text-black mt-2">{{ questDescription }}</p>
            </div>

            <!-- Form -->
            <div class="mb-10">
                <label for="difficulty" class="block mb-2 text-sm font-semibold">Your Difficulty Estimate</label>

                <select v-model="level" class="w-full rounded bg-zinc-900 border border-zinc-700 p-2 text-white">
                    <option disabled value="" selected hidden>Choose difficulty tier</option>
                    <option v-for="opt in levelOptions" :key="opt.value" :value="opt.value">
                        {{ opt.label }}
                    </option>
                </select>


                <label for="notes" class="block mt-4 mb-2 text-sm font-semibold">Optional Notes</label>
                <textarea id="notes" v-model="notes"
                    class="w-full rounded bg-zinc-900 border border-zinc-700 p-2 text-white" rows="4"
                    placeholder=" Thoughts, considerations, or reasoning behind your estimate..."></textarea>

                <button @click="submitEstimation"
                    class="mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white"
                    :disabled="level === null">
                    Submit Estimate
                </button>
            </div>

            <!-- Past Reviews -->
            <div>
                <h3 class="text-lg font-semibold mb-4">Recent Estimations</h3>
                <ul class="space-y-3">
                    <li v-for="(est, i) in pastEstimates" :key="i"
                        class="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                        <div class="flex justify-between items-center mb-1">
                            <span class="font-bold">{{ est.user }}</span>
                            <span class="text-sm text-zinc-400">{{ est.level }}</span>
                        </div>
                        <p class="text-zinc-300 text-sm">{{ est.notes }}</p>
                    </li>
                </ul>
            </div>
        </div>
    </NuxtLayout>
</template>
