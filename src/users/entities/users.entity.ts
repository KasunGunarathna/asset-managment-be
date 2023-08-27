import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

enum UserType {
  Admin = 'Admin',
  Collector = 'Collector',
  Viewer = 'Viewer',
}

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: UserType })
  user_type: UserType;

  @Column()
  nic: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
