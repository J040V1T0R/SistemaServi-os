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

// update a service order
export async function updateOrder(orderId: string | number, orderData: any) {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to update order');
  }
  return res.json();
}

// fetch technicians
export async function getTechnicians() {
  const res = await fetch(`${API_BASE}/api/technicians`);
  if (!res.ok) throw new Error('Failed to load technicians');
  return res.json();
}

// get total billing for completed orders
export async function getBilling() {
  const res = await fetch(`${API_BASE}/api/billing`);
  if (!res.ok) throw new Error('Failed to load billing');
  return res.json();
}

// add technician
export async function addTechnician(data: any) {
  console.log('📤 API addTechnician() recebeu:', data);
  const bodyToSend = JSON.stringify(data);
  console.log('📤 String JSON a enviar:', bodyToSend);
  
  const res = await fetch(`${API_BASE}/api/technicians`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: bodyToSend,
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to add technician');
  }
  return res.json();
}

// delete technician
export async function deleteTechnician(id: string) {
  const res = await fetch(`${API_BASE}/api/technicians/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to delete technician');
  }
  return res.json();
}

