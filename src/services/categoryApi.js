const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success || !Array.isArray(result.data)) {
    throw new Error(result?.message || 'Не вдалося завантажити категорії');
  }

  return result.data;
}
