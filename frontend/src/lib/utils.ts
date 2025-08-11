import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
// ===== Backend URL helpers =====
const DEV_FALLBACK = process.env.NODE_ENV === "development" ? "http://localhost:8000" : "";

// 给浏览器用：从 NEXT_PUBLIC_BACKEND_URL 读取
export const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL ?? DEV_FALLBACK).replace(/\/$/, "");

/** 拼 HTTP 地址：apiUrl('/api/v1/chat') -> https://xxx.railway.app/api/v1/chat */
export function apiUrl(path: string) {
  if (!API_BASE) throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

/** 拼 WS 地址：wsUrl('/api/v1/chat/stream') -> wss://xxx.railway.app/api/v1/chat/stream */
export function wsUrl(path: string) {
  if (!API_BASE) throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
  const u = new URL(API_BASE);
  u.protocol = u.protocol === "https:" ? "wss:" : "ws:";
  const p = path.startsWith("/") ? path : `/${path}`;
  u.pathname = `${u.pathname.replace(/\/$/, "")}${p}`;
  return u.toString();
}
