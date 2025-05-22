// middleware/auth.ts
export default defineNuxtRouteMiddleware(() => {

  const user = useAuthUser();

  if (!user.value) {
    return navigateTo("/error"); // or "/choose-role"
  }
});
