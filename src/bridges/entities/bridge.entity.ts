import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('bridges')
export class BridgesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bridge_name: string;

  @Column()
  road_name: string;

  @Column('float', { precision: 10, scale: 6 })
  latitude: number;

  @Column('float', { precision: 10, scale: 6 })
  longitude: number;

  @Column('float', { precision: 10, scale: 2 })
  length: number;

  @Column('float', { precision: 8, scale: 2 })
  width: number;

  @Column()
  structure_condition: string;

  @Column()
  road_surface_condition: string;

  @Column()
  remarks: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
