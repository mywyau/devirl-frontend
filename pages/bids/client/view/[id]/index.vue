<script setup lang="ts">

import TotalLevelPaginationControls from "@/components/ui/hiscores/TotalLevelPaginationControls.vue";
import { useAuthUser } from '@/composables/useAuthUser';
import { loadConfig } from '@/configuration/ConfigLoader';
import { roundUpTo2DP } from "@/service/AddRewardService";
import { type GetDevBid } from "@/types/schema/DevBidSchema";
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';


const route = useRoute();
const questIdFromRoute = route.params.id as string;

const config = loadConfig()
const baseUrl = `${config.devQuestBackend.baseUrl}/`

const { data: user } = await useAuthUser()

const safeUserId = computed(() => user.value?.sub)

const currentPage = ref(1)
const itemsPerPage = 2
const totalDevBidCount = ref(0)
const pagedGetDevBid = ref<GetDevBid[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const hasLoaded = ref(false)


async function fetchTotalCount() {

    try {
        const res =
            await $fetch<{ numberOfDevBids: number }>(
                `${baseUrl}dev/bids/count/${encodeURIComponent(safeUserId.value)}/${questIdFromRoute}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            )
        console.log("Fetched total count:", res.numberOfDevBids);
        totalDevBidCount.value = res.numberOfDevBids
    } catch (err) {
        error.value = "Failed to fetch total count"
    }
}

async function fetchDataForPage(page: number) {

    loading.value = true
    try {
        const offset = (page - 1) * itemsPerPage
        const res =
            await $fetch<GetDevBid[]>(
                `${baseUrl}dev/bids/${encodeURIComponent(safeUserId.value)}/${questIdFromRoute}?page=${page}&limit=${itemsPerPage}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            )
        pagedGetDevBid.value = res
        console.log(pagedGetDevBid.value)
    } catch (err) {
        error.value = "Failed to fetch data"
    } finally {
        loading.value = false
    }
}

watch(currentPage, async (page) => {
    await fetchTotalCount()
    await fetchDataForPage(page)
    hasLoaded.value = true
}, { immediate: true })

</script>

<template>
    <NuxtLayout>

        <div class="w-full max-w-4xl mx-auto px-4 pt-10 flex flex-col gap-6 text-white min-h-screen">

            <div v-if="hasLoaded && pagedGetDevBid.length === 0" class="flex-1 mx-4 md:mx-20">

                <h1 class="font-heading text-3xl font-semibold mb-6 text-center text-teal-300">
                    Developer Bids for Quest
                </h1>

                <div v-if="pagedGetDevBid.length === 0">
                    <p>No bids have been made yet</p>
                </div>
            </div>

            <div v-else-if="hasLoaded && pagedGetDevBid.length > 0" class="flex-1 mx-4 md:mx-20">

                <h1 class="font-heading text-3xl font-semibold mb-6 text-center text-teal-300">
                    Developer Bids for your Quest
                </h1>

                <div class="text-zinc-400 text-base mt-4 mb-6">
                    <p>
                        There {{ totalDevBidCount === 1 ? 'is' : 'are' }}
                        <span class="text-green-400">{{ totalDevBidCount }}</span>
                        {{ totalDevBidCount === 1 ? 'bid' : 'bids' }}.
                    </p>
                </div>

                <div v-if="pagedGetDevBid.length > 0">

                    <div class="flex justify-between items-center">

                    </div>
                    <ul class="space-y-3">
                        <li v-for="(getDevBid, i) in pagedGetDevBid" :key="i" class="bg-zinc-800 p-4 rounded">
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-base text-white">
                                    <span class="text-blue-400 capitalize">{{ getDevBid.devUsername }}</span>
                                </span>
                            </div>
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-sm text-white">
                                    Bid: <span class="text-green-400">${{ roundUpTo2DP(getDevBid.bid / 100) }}</span>
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>

                <TotalLevelPaginationControls
                    v-if="!loading && pagedGetDevBid.length > 0 && totalDevBidCount > itemsPerPage" :page="currentPage"
                    :total="totalDevBidCount" :items-per-page="itemsPerPage"
                    @update:page="(newPage) => currentPage = newPage" />

            </div>
        </div>
    </NuxtLayout>
</template>