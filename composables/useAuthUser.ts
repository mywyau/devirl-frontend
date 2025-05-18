import { useFetch } from "nuxt/app";

export const useAuthUser = async () => {
  const { data, error } = await useFetch('/api/auth/session', {
    credentials: 'include',
  });

  return { user: data, error };
};
