// ================================================
// AUTH — uses API server, session in localStorage
// Phone-based authentication
// ================================================

import { api } from './api.js';

const SESSION_KEY = 'gfa_session';

export async function register(data) {
  const result = await api.register(data);
  if (!result) return { ok: false, error: 'Server unavailable. Please try again.' };
  return result;
}

// Phone or email login — does NOT store session (waits for OTP)
export async function loginWithPhoneOrEmail(phone, email, password) {
  const result = await api.loginWithPhoneOrEmail(phone, email, password);
  if (!result) return { ok: false, error: 'Server unavailable. Please try again.' };
  return result;
}

// Legacy email login kept for admin (no OTP)
export async function login(email, password) {
  const result = await api.login(email, password);
  if (!result) return { ok: false, error: 'Server unavailable. Please try again.' };
  if (result.ok && result.user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(result.user));
  }
  return result;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
}

export function isLoggedIn() {
  return !!getCurrentUser();
}

export async function getAllUsers() {
  const users = await api.getUsers();
  return users || [];
}

export async function approveUser(id) {
  return api.approveUser(id);
}

export async function updateCurrentUser(updates) {
  const session = getCurrentUser();
  if (!session) return false;
  const result = await api.updateUser(session.id, updates);
  if (result?.ok) {
    const newSession = { ...session, ...updates };
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
  }
  return result?.ok || false;
}
