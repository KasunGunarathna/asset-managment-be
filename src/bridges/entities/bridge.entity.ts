import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

enum Condition {
  Excellent = 'Excellent',
  Good = 'Good',
  Average = 'Average',
  Poor = 'Poor',
  VeryPoor = 'Very poor',
}

@Entity('bridges')
export class BridgesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bridge_name: string;

  @Column()
  road_name: string;

  @Column()
  location: string;

  @Column('float', { precision: 10, scale: 2 })
  length: number;

  @Column('float', { precision: 8, scale: 2 })
  width: number;

  @Column({ type: 'enum', enum: Condition })
  structure_condition: string;

  @Column({ type: 'enum', enum: Condition })
  road_surface_condition: string;

  @Column()
  remarks: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
