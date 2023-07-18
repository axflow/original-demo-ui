import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEnv(key: string) {
  return process.env[key];
}

export function getEnvOrThrow(key: string) {
  const value = getEnv(key);

  if (!value) {
    throw new Error(`Expected "${key}" to be set in the process environment`);
  }

  return value;
}
