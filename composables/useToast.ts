import { ref } from 'vue'

const toasts = ref([] as { id: number, title: string, message: string }[])

export function useToast() {
  function show({ title, message }: { title: string, message: string }) {
    const id = Date.now()
    toasts.value.push({ id, title, message })

    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 5000)
  }

  return { toasts, show }
}
