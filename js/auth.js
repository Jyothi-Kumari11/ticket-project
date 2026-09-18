// =====================================================
// ResolveDesk – Auth Module
// =====================================================

const SESSION_KEY = 'resolvedesk_session';

function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY + '_persist');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function setSession(user, persist = false) {
  const session = { userId: user.id, role: user.role, name: user.name, initials: user.initials, avatarColor: user.avatarColor };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  if (persist) localStorage.setItem(SESSION_KEY + '_persist', JSON.stringify(session));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY + '_persist');
}

function isLoggedIn() { return !!getSession(); }

function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  return DB.getUserById(session.userId);
}

function isAdmin() {
  const session = getSession();
  return session?.role === 'admin';
}

function login(email, password, remember = false) {
  const user = DB.getUserByEmail(email);
  if (!user) return { success: false, error: 'No account found with this email.' };
  if (user.password !== password) return { success: false, error: 'Incorrect password. Please try again.' };
  setSession(user, remember);
  return { success: true, user };
}

function register(data) {
  if (!data.name?.trim()) return { success: false, error: 'Full name is required.' };
  if (!data.email?.trim()) return { success: false, error: 'Email is required.' };
  if (!data.password?.trim()) return { success: false, error: 'Password is required.' };
  if (data.password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };
  const existing = DB.getUserByEmail(data.email);
  if (existing) return { success: false, error: 'An account with this email already exists.' };
  const user = DB.createUser(data);
  setSession(user, false);
  return { success: true, user };
}

function logout() {
  clearSession();
  window.location.hash = '#login';
}

window.Auth = { getSession, getCurrentUser, isLoggedIn, isAdmin, login, register, logout };
