export const deriveRoleFromClaims = (claims = {}) => {
  if (typeof claims.role === 'string') {
    const trimmedRole = claims.role.trim();
    if (trimmedRole) {
      return trimmedRole.toLowerCase();
    }
  }

  const prioritizedRoles = ['admin', 'b2b', 'b2c'];

  if (Array.isArray(claims.roles) && claims.roles.length) {
    const normalizedRoles = new Set(claims.roles.map((role) => String(role).toLowerCase()));
    for (const role of prioritizedRoles) {
      if (normalizedRoles.has(role)) return role;
    }
  }

  for (const role of prioritizedRoles) {
    if (claims[role] === true) return role;
  }

  return null;
};
