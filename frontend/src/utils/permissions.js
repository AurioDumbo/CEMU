export const getUserRole = () => {
  return Number(sessionStorage.getItem('role')) || 3;
};

export const isAdmin = () => getUserRole() === 1;
export const isEmployee = () => getUserRole() === 2;
export const isReader = () => getUserRole() === 3;

export const canEditContent = () => {
  const role = getUserRole();
  return role === 1 || role === 2;
}; 