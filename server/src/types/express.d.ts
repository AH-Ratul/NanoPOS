import { Role } from '../generated/prisma-client/index.js';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
        role: Role;
      };
    }
  }
}
