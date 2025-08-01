<script setup lang="ts">
import Input from '@/components/reka/Input.vue';
import { useAuthUser } from '@/composables/useAuthUser';
import { loadConfig } from '@/configuration/ConfigLoader';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';


import { DevBidSchema, type DevBid } from "@/types/schema/DevBidSchema";


const route = useRoute();
const questIdFromRoute = route.params.id as string;
const questId = questIdFromRoute

const config = loadConfig()
const baseUrl = `${config.devQuestBackend.baseUrl}/`

const { data: user } = await useAuthUser()

const safeUserId = computed(() => user.value?.sub)

const isLoading = ref(false);

const devBidAmount = ref(0);

const editMode = ref(false)

const devBidSuccess = ref(false)
const devBidError = ref<string | null>(null)

const devBidGetResult = ref<DevBid | null>(null);

onMounted(async () => {

    const safeUserId = user.value?.sub || "No user id";
    console.debug(encodeURIComponent(safeUserId));

    try {

        devBidGetResult.value = await $fetch(`${baseUrl}dev/bid/${encodeURIComponent(safeUserId)}/${questIdFromRoute}`, {
            method: "GET",
            credentials: "include",
        });

        if (devBidGetResult.value) {
            devBidAmount.value = Math.round((devBidGetResult.value.bid || 0) / 100);
            editMode.value = true;
        }

    } catch (e: any) {
        if (e?.response?.status == 400) {  // Handle Bad Request
            // No reward yet – totally fine
            devBidGetResult.value = null;
        } else {
            devBidError.value = "Failed to retrieve reward data.";
            console.error(e);
        }
    } finally {
        isLoading.value = false;
    }
});

async function submitDevBid() {

    devBidError.value = null;
    devBidSuccess.value = false;

    const validation = DevBidSchema.safeParse({
        bid: devBidAmount.value,
    });

    if (!validation.success) {
        for (const issue of validation.error.issues) {
            if (issue.path[0] === "devBidAmount") {
                devBidError.value = issue.message;
            }
        }
        return;
    }

    try {

        const devBidCents = Math.round(devBidAmount.value * 100);

        await $fetch(`${baseUrl}dev/bid/upsert/${encodeURIComponent(safeUserId.value)}/${questIdFromRoute}`, {
            method: "PUT",
            credentials: "include",
            body: {
                bid: devBidCents
            },
        });

        devBidSuccess.value = true;
    } catch (e: any) {
        devBidError.value = "Failed to save Bid. Please try again.";
        console.error(e);
    }
}

</script>

<template>
    <NuxtLayout>

        <div class="max-w-xl mx-auto py-10 px-6 text-white">

            <div class="mb-6">
                <h1 class="text-3xl font-bold mb-6 text-green-300">Bid</h1>

                <p v-if="devBidSuccess" class="mt-4 text-green-400 font-semibold">
                    ${{ devBidAmount.toFixed(2) }} Bid Saved!
                </p>

                <div>
                    <div class="mt-6 mb-6">

                        <p v-if="editMode === true" class="mb-6">Please update the Bid for the total time spent working on the task.</p>
                        <p v-else class="mb-6">Please add a Bid for the total time spent working on the task.</p>

                        <label for="time-reward-amount" class="block text-base text-green-400 mb-2">Bid ($)</label>
                        <p class="text-sm mb-1">
                            Hint: You can come back and update the bid if the quest status is
                        </p>
                        <p class="text-sm mb-4">
                            <span class="text-zinc-400 font-medium">Not Estimated</span> or
                            <span class="text-orange-400 font-medium">Estimated</span>.
                        </p>
                        <Input id="time-reward-amount" type="number" v-model="devBidAmount"
                            placeholder="Example: 100.00" class="w-1/3" 
                        />
                        <p v-if="devBidError" class="mt-4 text-red-400">{{ devBidError }}</p>

                    </div>
                </div>

                <div v-if="devBidAmount > 0" class="mt-4 mb-6 text-base text-zinc-300 space-y-2">
                    <p>
                        <strong>Bid:</strong>
                        <span class="text-green-300 font-sans">
                            ${{ devBidAmount.toFixed(2) }}
                        </span>
                    </p>
                </div>

                <button v-if="editMode === true" @click="submitDevBid"
                    class="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded">
                    Update Bid
                </button>
                <button v-else="" @click="submitDevBid"
                    class="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded">
                    Submit Bid
                </button>
            </div>

            <!-- <RewardAccordion :items="accordionItems" /> -->
        </div>


    </NuxtLayout>
</template>
