import { TokenType } from 'src/entities';

export abstract class TokenAbstract {
  token: string;
  isUsed: boolean;
  type: TokenType;
  expiresAt: Date;
  userId: string;
  generateToken: () => Promise<void>;
}
