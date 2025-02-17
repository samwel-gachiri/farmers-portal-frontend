import store from '@/store';

const getUser = () => store.getters['auth/authenticatedUser'];
const viewPermissions = (roles = []) => {
  const user = getUser();
  if (user == null) return [];
  return roles.length === 0
    ? false
    : [...roles, ...['admin']].includes(user['custom:role']);
};

const getCurrentUserRole = () => {
  const user = getUser();
  if (user == null) return [];
  return user['custom:role'];
};

const getCurrentUserId = () => {
  const user = getUser();
  if (user == null) return '';
  return user.sub;
};

const isAuthenticated = () => {
  const user = getUser();
  return user != null;
};

export {
  viewPermissions, getCurrentUserRole, getCurrentUserId, isAuthenticated,
};
