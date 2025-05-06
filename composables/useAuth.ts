import { useNuxtApp } from "#imports"
;

export const useAuth = () => {
  const auth0 = useNuxtApp().$auth0;

  return {
    login: () => auth0.loginWithRedirect(),
    logout: () =>
      auth0.logout({ logoutParams: { returnTo: window.location.origin } }),
    getUser: () => auth0.getUser(),
    isAuthenticated: () => auth0.isAuthenticated(),
    getToken: () => auth0.getTokenSilently()  // ✅ added for silent token fetch
  };
};
