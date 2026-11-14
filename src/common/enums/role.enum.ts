export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",

}

// Role hierarchy key:value pairs
export const RoleHierarchy: { [key in Role]: number } = {
  [Role.SUPER_ADMIN]: 8,
  [Role.ADMIN]: 7,
  [Role.USER]: 1,
};
