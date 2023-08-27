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

  @Column('float', { precision: 10, scale: 6 })
  starting_point_latitude: number;

  @Column('float', { precision: 10, scale: 6 })
  starting_point_longitude: number;

  @Column('float', { precision: 10, scale: 6 })
  end_point_latitude: number;

  @Column('float', { precision: 10, scale: 6 })
  end_point_longitude: number;

  @Column()
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
