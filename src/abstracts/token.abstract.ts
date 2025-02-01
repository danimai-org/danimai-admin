import { TokenType } from 'src/entities';
import { UserAbstract } from './user.abstract';

export abstract class TokenAbstract {
  token: string;
  isUsed: boolean;
  type: TokenType;
  expiresAt: Date;
  user: UserAbstract;
  generateToken: () => Promise<void>;
}
