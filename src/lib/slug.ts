import { supabase } from '@/lib/supabase';

/**
 * Convert a string into a URL-friendly slug.
 * Removes diacritics, lowercases, replaces non-alphanumeric with hyphens.
 */
export const slugify = (input: string): string => {
  if (!input) return '';
  return input
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
};

/**
 * Ensure slug is unique in the portfolios table.
 * If taken (by a different user), append -2, -3, ...
 */
export const generateUniqueSlug = async (
  base: string,
  currentUserId: string
): Promise<string> => {
  const baseSlug = slugify(base) || 'portfolio';
  let candidate = baseSlug;
  let suffix = 1;

  // Try up to 50 variations
  while (suffix < 50) {
    const { data, error } = await supabase
      .from('portfolios')
      .select('user_id')
      .eq('slug', candidate)
      .maybeSingle();

    if (error) break;
    if (!data || data.user_id === currentUserId) {
      return candidate;
    }
    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }
  // Fallback
  return `${baseSlug}-${Date.now()}`;
};
