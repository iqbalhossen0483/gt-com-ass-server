enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  EDITOR = 'EDITOR',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

type TokenPayload = {
  id: string;
  role: UserRole;
};
