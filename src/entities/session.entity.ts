import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base';

@Entity({
  name: 'sessions',
})
export class Session extends BaseEntity {
  @ManyToOne(() => User, (user) => user.sessions, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  @Index()
  userId: string;
}
