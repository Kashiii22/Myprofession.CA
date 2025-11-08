/**
 * Authentication utility functions for role-based access control
 */

/**
 * Check if a user has SUPERADMIN role
 * @param {Object} user - User object from Redux store
 * @returns {boolean}
 */
export const isSuperAdmin = (user) => {
  if (!user) {
    console.log('🛑 isSuperAdmin: No user object');
    return false;
  }
  
  console.log('🔍 isSuperAdmin: Checking user object:', user);
  
  // Extract all possible role-related fields
  const possibleRoles = [
    user.role,
    user.userRole,
    user.user_type,
    user.type,
    user.userType,
    user.user_role,
    user.accountType,
    user.account_type,
    user.permissions?.role,
    user.auth?.role
  ].filter(Boolean);
  
  console.log('🔍 isSuperAdmin: Found possible roles:', possibleRoles);
  
  // Support various formats of admin roles
  const superAdminVariants = [
    'SUPERADMIN', 'admin', 'superadmin', 
    'SUPER_ADMIN', 'SuperAdmin', 'super_admin',
    'ADMIN', 'Admin', 'administrator',
    'ROOT', 'root', 'system_admin'
  ];
  
  // Check if any role matches
  const isSuper = possibleRoles.some(role => 
    superAdminVariants.includes(role?.toString())
  );
  
  console.log('🔍 isSuperAdmin: isSuper =', isSuper, 'for roles:', possibleRoles);
  
  return isSuper;
};

/**
 * Check if a user is authenticated
 * @param {Object} user - User object from Redux store
 * @returns {boolean}
 */
export const isAuthenticated = (user) => {
  return !!user;
};

/**
 * Get user display name
 * @param {Object} user - User object from Redux store
 * @returns {string}
 */
export const getUserDisplayName = (user) => {
  if (!user) return 'Unknown User';
  return user.name || user.firstName || user.username || user.email || 'User';
};

/**
 * Check if user can access superadmin routes
 * @param {Object} user - User object from Redux store
 * @returns {boolean}
 */
export const canAccessSuperAdmin = (user) => {
  return isAuthenticated(user) && isSuperAdmin(user);
};

/**
 * Get user initials for avatar
 * @param {Object} user - User object from Redux store
 * @returns {string}
 */
export const getUserInitials = (user) => {
  if (!user) return '?';
  
  const fullName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim();
  if (!fullName) return '?';
  
  return fullName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
