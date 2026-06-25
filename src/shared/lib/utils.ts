import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Theme = 'light';

export function getTheme(): Theme {
  return 'light';
}

export function setTheme(theme: Theme) {
  applyTheme(theme);
}

export function applyTheme(_theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('dark');
}
