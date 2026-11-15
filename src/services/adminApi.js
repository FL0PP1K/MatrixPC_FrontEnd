const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function request(path, { token, ...options } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || `Помилка запиту (${response.status})`);
  }
  return result.data;
}

export const getAdminProducts = () => request('/products');
export const getAdminCategories = () => request('/categories');
export const createCategory = (token, data) =>
  request('/categories', { token, method: 'POST', body: JSON.stringify(data) });
export const updateCategory = (token, id, data) =>
  request(`/categories/${encodeURIComponent(id)}`, { token, method: 'PATCH', body: JSON.stringify(data) });
export const deleteCategory = (token, id) =>
  request(`/categories/${encodeURIComponent(id)}`, { token, method: 'DELETE' });
export const getAdminOrders = (token) =>
  request('/orders/admin', { token });
export const updateAdminOrderStatus = (token, id, status) =>
  request(`/orders/admin/${encodeURIComponent(id)}/status`, {
    token,
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
