import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

enum BuildingCondition {
  Excellent = 'Excellent',
  Good = 'Good',
  Average = 'Average',
  Poor = 'Poor',
  VeryPoor = 'Very poor',
}

@Entity('buildings') // Replace 'buildings' with the appropriate table name
export class BuildingsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  plan: string;

  @Column()
  location: string;

  @Column('float', { precision: 10, scale: 2 })
  length: number;

  @Column('float', { precision: 8, scale: 2 })
  width: number;

  @Column({ type: 'enum', enum: BuildingCondition })
  condition: string;

  @Column()
  remarks: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Additional properties specific to buildings if needed
}
