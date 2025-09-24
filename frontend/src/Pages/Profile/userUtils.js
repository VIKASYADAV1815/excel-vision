// userUtils.js

export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
} 