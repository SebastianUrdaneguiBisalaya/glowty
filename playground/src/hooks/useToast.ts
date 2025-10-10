import { useToastStore } from '@/store/useToastStore';

export function useToast() {
  const addToast = useToastStore(state => state.addToast);
  const removeToast = useToastStore(state => state.removeToast);
  const clearToasts = useToastStore(state => state.clearToasts);
  const promiseToast = useToastStore(state => state.promiseToast);

  return {
    addToast,
    removeToast,
    clearToasts,
    promiseToast,
  };
}
