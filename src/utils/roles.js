// eslint-disable-next-line import/extensions
import store from '@/store';

const getUser = () => store.getters['auth/authenticatedUser'];
const getRole = () => store.getters['auth/role'];
const viewPermissions = (roles = []) => {
  const user = getUser();
  if (user == null) return [];
  return roles.length === 0
    ? false
    : [...roles, ...['admin']].includes(getRole());
};

const getCurrentUserRole = () => getRole();

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
