import { BaseEntity, TokenType } from 'src/entities';
import { UserAbstract } from './user.abstract';

export abstract class TokenAbstract extends BaseEntity {
  token: string;
  isUsed: boolean;
  type: TokenType;
  expiresAt: Date;
  user: UserAbstract;
  generateToken: () => Promise<void>;
}
