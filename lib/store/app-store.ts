"use client";
import { create } from "zustand";

type Theme = "dark" | "light";
type AIStatus = "online" | "thinking" | "processing";

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
}

interface AppState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // AI Status
  aiStatus: AIStatus;
  setAiStatus: (status: AIStatus) => void;

  // Active Chat
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Toast
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;

  // Reconnect Modal
  reconnectModal: { open: boolean; integration: string | null };
  showReconnectModal: (integration: string) => void;
  hideReconnectModal: () => void;

  // User Plan
  userPlan: "free" | "plus" | "pro";

  // Notification Badge
  notifications: number;
}

export const useAppStore = create<AppState>((set) => ({
  theme: "dark",
  setTheme: (theme) => {
    set({ theme });
    if (typeof document !== "undefined") {
      if (theme === "light") {
        document.documentElement.classList.add("theme-light");
      } else {
        document.documentElement.classList.remove("theme-light");
      }
    }
  },
  toggleTheme: () =>
    set((s) => {
      const newTheme = s.theme === "dark" ? "light" : "dark";
      if (typeof document !== "undefined") {
        if (newTheme === "light") {
          document.documentElement.classList.add("theme-light");
        } else {
          document.documentElement.classList.remove("theme-light");
        }
      }
      return { theme: newTheme };
    }),

  aiStatus: "online",
  setAiStatus: (aiStatus) => set({ aiStatus }),

  activeChatId: "chat-1",
  setActiveChatId: (activeChatId) => set({ activeChatId }),

  sidebarOpen: true,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  toasts: [],
  addToast: (toast) =>
    set((s) => ({
      toasts: [...s.toasts, { ...toast, id: Math.random().toString(36).slice(2) }],
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  reconnectModal: { open: false, integration: null },
  showReconnectModal: (integration) =>
    set({ reconnectModal: { open: true, integration } }),
  hideReconnectModal: () =>
    set({ reconnectModal: { open: false, integration: null } }),

  userPlan: "plus",
  notifications: 2,
}));
