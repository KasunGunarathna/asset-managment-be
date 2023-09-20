import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

enum DrainageType {
  OpenUDrain = 'Open U drain',
  CloseUDrain = 'Close U drain',
  ShoueDrain = 'Shoue drain',
  EarthDrain = 'Earth Drain',
}

enum DrainageSide {
  Left = 'Left',
  Right = 'Right',
}

enum Condition {
  Excellent = 'Excellent',
  Good = 'Good',
  Average = 'Average',
  Poor = 'Poor',
  VeryPoor = 'Very poor',
}

@Entity('drainage')
export class DrainageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  road_name: string;

  @Column({ type: 'enum', enum: DrainageType })
  drainage_type: DrainageType;

  @Column({ type: 'enum', enum: DrainageSide })
  side_of_drain: DrainageSide;

  @Column()
  starting_point_location: string;

  @Column()
  end_point_location: string;

  @Column({ type: 'enum', enum: Condition })
  condition: string;

  @Column('float', { precision: 10, scale: 2 })
  length: number;

  @Column('float', { precision: 8, scale: 2 })
  width: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
