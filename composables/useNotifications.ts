// import { useToast } from '@/composables/useToast'

// export function useNotifications() {
//   if (process.server) return

//   const toast = useToast()

//   const ws = new WebSocket('ws://localhost:8081/notifications')

//   ws.onopen = () => {
//     console.log("[WS] Connected to notifications service")
//   }

//   ws.onmessage = (msg) => {
//     try {
//       const notification = JSON.parse(msg.data)

//       console.log("[WS] Notification received:", notification)

//       toast.show({
//         title: notification.title,
//         message: notification.message
//       })
//     } catch (err) {
//       console.error("[WS] Failed to parse notification", err)
//     }
//   }

//   ws.onerror = (e) => {
//     console.error("[WS] ERROR:", e)
//   }

//   ws.onclose = () => {
//     console.warn("[WS] Disconnected from notifications service")
//   }
// }
