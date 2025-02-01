import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base';
import { SessionAbstract } from 'src/abstracts';

@Entity({
  name: 'sessions',
})
export class Session extends BaseEntity implements SessionAbstract {
  @ManyToOne(() => User, (user) => user.sessions, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  @Index()
  userId: number;
}
