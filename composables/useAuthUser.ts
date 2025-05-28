// ~/composables/useAuthUser.ts

export const useAuthUser = () => {
  return useAsyncData('auth-user', () =>
    $fetch('/api/auth/session', { credentials: 'include' })
  );
};
