export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

export async function getStatus() {
  const res = await fetch(`${API_BASE}/api/status`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}

// fetch all service orders
export async function getOrders() {
  const res = await fetch(`${API_BASE}/api/orders`);
  if (!res.ok) throw new Error('Failed to load orders');
  return res.json();
}

// create a new service order
export async function createOrder(orderData: any) {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to create order');
  }
  return res.json();
}
