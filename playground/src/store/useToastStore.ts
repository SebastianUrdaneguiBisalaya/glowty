import { create } from 'zustand';
// import { nanoid } from 'nanoid';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

export type ToastPosition = 'top' | 'bottom' | 'center';

export type ToastForm = 'box' | 'bar' | 'full-bleed';

export interface ToastComponents {
  success?: React.ComponentType<{ toast: Toast }>;
  error?: React.ComponentType<{ toast: Toast }>;
  info?: React.ComponentType<{ toast: Toast }>;
  warning?: React.ComponentType<{ toast: Toast }>;
  loading?: React.ComponentType<{ toast: Toast }>;
}

type ThemeType = 'light' | 'dark';

interface ContainerStyles {
  fontSize?: number;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
  margin?: number;
}

interface ContentStyles {
  color?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  iconSize?: number;
}

export interface Toast {
  description?: string;
  duration?: number;
  form?: ToastForm;
  id: string;
  message: string;
  persistent?: boolean;
  position?: ToastPosition;
  promiseId?: string;
  type?: ToastType;
  onActionPress?: () => void;
  containerStyles?: ContainerStyles;
  contentStyles?: ContentStyles;
  theme?: ThemeType;
}

export interface ToastDefaults {
  duration: number;
  form: ToastForm;
  position: ToastPosition;
  type: ToastType;
  persistent: boolean;
  maxToasts?: number;
  theme?: ThemeType;
  onActionPress?: () => void;
}

export interface ToastState {
  visibleToasts: Toast[];
  queue: Toast[];
  defaults: ToastDefaults;
  components: ToastComponents;
  containerStyles: ContainerStyles;
  contentStyles: ContentStyles;

  setDefaults: (defaults: Partial<ToastDefaults>) => void;
  setComponents: (components: Partial<ToastComponents>) => void;
  setCustomStyles: (customStyles: Partial<ContainerStyles>) => void;
  setContentStyles: (contentStyles: Partial<ContentStyles>) => void;

  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  processQueue: () => void;
  clearToasts: () => void;

  updateToastByPromise: (promiseId: string, toast: Partial<Toast>) => void;
  promiseToast: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
    descriptions?: { loading?: string; success?: string; error?: string },
  ) => Promise<{ result: T; promiseId: string }>;
}

export const useToastStore = create<ToastState>((set, get) => ({
  visibleToasts: [],
  queue: [],
  defaults: {
    duration: 5000,
    form: 'box',
    maxToasts: 3,
    position: 'bottom',
    type: 'success',
    persistent: false,
    theme: 'dark',
  },
  containerStyles: {
    fontSize: undefined,
    backgroundColor: undefined,
    borderRadius: undefined,
    padding: undefined,
    margin: undefined,
  },
  contentStyles: {
    color: undefined,
    icon: undefined,
    iconColor: undefined,
  },
  components: {},
  setComponents: components => {
    set(state => ({
      components: { ...state.components, ...components },
    }));
  },
  setCustomStyles: containerStyles => {
    set(state => ({
      containerStyles: { ...state.containerStyles, ...containerStyles },
    }));
  },
  setContentStyles: contentStyles => {
    set(state => ({
      contentStyles: { ...state.contentStyles, ...contentStyles },
    }));
  },
  addToast: toast => {
    const id = Math.random().toString(36).substring(2, 10);
    const defaults = get().defaults;
    const merged: Toast = {
      id,
      ...toast,
      duration: toast.duration ?? defaults.duration,
      form: toast.form ?? defaults.form,
      position: toast.position ?? defaults.position,
      type: toast.type ?? defaults.type,
      persistent: toast.persistent ?? defaults.persistent,
      theme: toast.theme ?? defaults.theme,
      onActionPress: toast.onActionPress ?? defaults.onActionPress,
    };

    const max = defaults.maxToasts ?? 3;
    const state = get();

    if (state.visibleToasts.length < max) {
      set(s => ({ visibleToasts: [...s.visibleToasts, merged] }));
      if (merged.type !== 'loading' && !merged.persistent) {
        const duration = merged.duration ?? defaults.duration;
        setTimeout(() => {
          get().removeToast(id);
        }, duration);
      }
    } else {
      set(s => ({ queue: [...s.queue, merged] }));
    }
    return id;
  },
  setDefaults: defaults => {
    set(state => ({
      defaults: { ...state.defaults, ...defaults },
    }));
  },
  removeToast: id => {
    set(state => ({
      visibleToasts: state.visibleToasts.filter(toast => toast.id !== id),
      // queue: state.queue.filter(toast => toast.id !== id),
    }));
    setTimeout(() => {
      get().processQueue();
    }, 0);
  },
  processQueue: () => {
    const state = get();
    if (state.queue.length === 0) return;

    const max = state.defaults.maxToasts ?? 3;
    const availableSlots = max - state.visibleToasts.length;
    if (availableSlots <= 0) return;

    const nextToasts = state.queue.slice(0, availableSlots);
    set(s => ({
      visibleToasts: [...s.visibleToasts, ...nextToasts],
      queue: state.queue.slice(availableSlots),
    }));

    nextToasts.forEach(toast => {
      if (toast.type !== 'loading' && !toast.persistent) {
        const duration = toast.duration ?? state.defaults.duration;
        setTimeout(() => {
          get().removeToast(toast.id);
        }, duration);
      }
    });
  },
  updateToastByPromise: (promiseId, toastPatch) => {
    set(state => ({
      visibleToasts: state.visibleToasts.map(toast => (toast.promiseId === promiseId ? { ...toast, ...toastPatch } : toast)),
      queue: state.queue.map(toast => (toast.promiseId === promiseId ? { ...toast, ...toastPatch } : toast)),
    }));

    const possiblyVisible = get().visibleToasts.find(toast => toast.promiseId === promiseId);
    if (possiblyVisible && possiblyVisible.type !== 'loading' && !possiblyVisible.persistent) {
      const duration = possiblyVisible.duration ?? get().defaults.duration;
      setTimeout(() => {
        get().removeToast(possiblyVisible.id);
      }, duration);
    }
  },
  clearToasts: () => {
    set({ visibleToasts: [], queue: [] });
  },
  promiseToast: async (promise, messages, descriptions) => {
    const promiseId = Math.random().toString(36).substring(2, 10);
    get().addToast({
      type: 'loading',
      message: messages.loading,
      description: descriptions?.loading,
      promiseId,
      persistent: true,
    });

    try {
      const result = await promise;
      get().updateToastByPromise(promiseId, {
        type: 'success',
        message: messages.success,
        description: descriptions?.success,
        persistent: false,
      });
      return { result, promiseId };
    } catch (error) {
      get().updateToastByPromise(promiseId, {
        type: 'error',
        message: messages.error,
        description: descriptions?.error,
        persistent: false,
      });
      throw { error, promiseId };
    }
  },
}));
