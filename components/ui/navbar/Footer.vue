<script setup lang="ts">
// No custom logic needed for the footer component right now
</script>

<template>
    <footer class="bg-zinc-200/90 dark:bg-zinc-800/90 border-t border-zinc-100 dark:border-zinc-800 px-6 py-6 text-sm text-zinc-700 dark:text-zinc-400"> 
        <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <h2 id="footer-dev-irl" class="text-black dark:text-white font-semibold text-base mb-1">Dev IRL</h2>
            </div>

            <div>
                <h3 class="text-black dark:text-white font-semibold text-base mb-1">Explore</h3>
                <ul class="space-y-1">
                    <li>
                        <NuxtLink to="/about" class="hover:text-black dark:hover:text-white hover:underline">About</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/faq" class="hover:text-black dark:hover:text-white hover:underline">FAQ</NuxtLink>
                    </li>
                </ul>
            </div>

            <div>
                <h3 class="text-black dark:text-white font-semibold text-base mb-1">Company</h3>
                <ul class="space-y-1">
                    <li><a href="mailto:team@devirl.com" class="hover:text-black dark:hover:text-white hover:underline">Contact</a></li>
                    <li>
                        <NuxtLink to="/privacy-policy" class="hover:text-black dark:hover:text-white hover:underline">Privacy Policy
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/terms-and-conditions" class="hover:text-black dark:hover:text-white hover:underline">Terms of Service
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </div>

        <div class="mt-6 text-center text-xs text-zinc-600">
            © {{ new Date().getFullYear() }} Dev IRL. All rights reserved.
        </div>
    </footer>
</template>
