import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration: number
}

let nextId = 0

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  function add(type: Toast['type'], message: string, duration = 4000) {
    const id = ++nextId
    toasts.value.push({ id, type, message, duration })
    if (duration > 0) setTimeout(() => remove(id), duration)
    return id
  }

  function remove(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function success(msg: string, duration?: number) { return add('success', msg, duration) }
  function error(msg: string, duration?: number) { return add('error', msg, duration) }
  function warning(msg: string, duration?: number) { return add('warning', msg, duration) }
  function info(msg: string, duration?: number) { return add('info', msg, duration) }

  return { toasts, add, remove, success, error, warning, info }
})
