// import { useAuth0 } from "@auth0/auth0-vue";

// export async function useSessionSync() {

//   const { getAccessTokenSilently, user } = useAuth0();
//   const accessToken = await getAccessTokenSilently();

//   if (user.value?.sub) {
//     await fetch(`https://api.devirl.com/auth/session/${user.value.sub}`, {
//       method: "POST",
//       headers: { "Content-Type": "text/plain" },
//       body: accessToken,
//       credentials: "include", // Optional if you’re also using cookies
//     });
//   }
// }
