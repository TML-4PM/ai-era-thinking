/**
 * Route guards and utilities for handling placeholder parameters and navigation
 */

/**
 * Checks if a parameter is a literal placeholder (e.g., ":bookSlug", ":slug")
 */
export function isPlaceholderParam(value: string | undefined): boolean {
  if (!value) return false;
  return value.startsWith(':');
}

/**
 * Validates route parameters and returns a safe value or null
 */
export function validateRouteParam(param: string | undefined, fallback?: string): string | null {
  if (!param || isPlaceholderParam(param)) {
    return fallback || null;
  }
  return param;
}
