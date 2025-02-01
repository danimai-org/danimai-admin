import { BaseEntity } from 'src/entities';
import { UserAbstract } from './user.abstract';

export abstract class SessionAbstract extends BaseEntity {
  user: UserAbstract;
}
