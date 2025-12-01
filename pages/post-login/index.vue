<script setup>
(async () => {
    const { data, error } = await useFetch('/api/me', {
        cache: 'no-cache'
    });

    if (error.value) {
        navigateTo('/');
    }

    if (!data.value?.isRegistered) {
        navigateTo('/registration');
    } else {
        navigateTo('/dashboard');
    }


})();
</script>

<template>
    <div>Redirecting...</div>
</template>
