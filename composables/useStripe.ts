// // composables/useStripeService.ts
// export function useStripeService() {

//   const config = useRuntimeConfig()

//   const createUpfront = async (amount: number) => {
//     return await $fetch<{ clientSecret: string }>(
//       `${config.public.apiBase}/payments/upfront`,
//       { method: 'POST', body: { amount } }
//     )
//   }

//   const createTime = async (minutes: number) => {
//     return await $fetch<{ clientSecret: string }>(
//       `${config.public.apiBase}/payments/time`,
//       { method: 'POST', body: { minutes } }
//     )
//   }

//   const createReward = async (jobId: string, amount: number) => {
//     return await $fetch<{ clientSecret: string }>(
//       `${config.public.apiBase}/payments/reward`,
//       { method: 'POST', body: { jobId, amount } }
//     )
//   }

//   return { createUpfront, createTime, createReward }
// }
