import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
enum PavementType {
  Asphalt = 'Asphalt',
  Tar = 'Tar',
  Concrete = 'Concrete',
  Interlock = 'Interlock',
  Gravel = 'Gravel',
}

enum SurfaceCondition {
  Excellent = 'Excellent',
  Good = 'Good',
  Average = 'Average',
  Poor = 'Poor',
  VeryPoor = 'Very poor',
}

enum DrainageAvailability {
  BothSide = 'Bothside',
  LeftSide = 'Left Side',
  RightSide = 'Right Side',
  NoDrain = 'No drain',
  DrainageProblems = 'Drainage problems',
}
@Entity('roads')
export class RoadEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  road_name: string;

  @Column('float', { precision: 10, scale: 2, nullable: true })
  length: number;

  @Column('float', { precision: 8, scale: 2, nullable: true })
  width: number;

  @Column('text', { nullable: true })
  gazetted_detail: string;

  @Column('text', { nullable: true })
  survey_plan: string;

  @Column({ type: 'enum', enum: SurfaceCondition })
  surface_condition: SurfaceCondition;

  @Column({ type: 'enum', enum: PavementType })
  pavement_type: PavementType;

  @Column('float', { precision: 10, scale: 6 })
  starting_point_latitude: number;

  @Column('float', { precision: 10, scale: 6 })
  starting_point_longitude: number;

  @Column('text', { nullable: true })
  starting_point_photo: string;

  @Column('float', { precision: 10, scale: 6 })
  end_point_latitude: number;

  @Column('float', { precision: 10, scale: 6 })
  end_point_longitude: number;

  @Column('text', { nullable: true })
  end_point_photo: string;

  @Column({ type: 'enum', enum: DrainageAvailability })
  drainage_availability: DrainageAvailability;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
