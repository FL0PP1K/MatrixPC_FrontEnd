const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function submitContactInquiry(inquiry) {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiry),
  });

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error('Сервер повернув некоректну відповідь. Спробуй ще раз.');
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Не вдалося надіслати звернення. Спробуй пізніше.');
  }

  return result.data;
}

