import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEnum } from 'class-validator';

enum BuildingCondition {
  Excellent = 'Excellent',
  Good = 'Good',
  Average = 'Average',
  Poor = 'Poor',
  VeryPoor = 'Very poor',
}

@Entity('buildings')
export class BuildingsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  plan: string;

  @Column({ type: 'int' }) // Update the column name
  number_of_stories: number; // Update the property name

  @Column({ default: null })
  photo: string;

  @Column()
  location: string;

  @Column({ type: 'int' }) // Update the column name
  built_year: number; // Update the property name

  @Column({ type: 'enum', enum: BuildingCondition })
  @IsEnum(BuildingCondition) // Add validation decorator
  condition: string;

  @Column()
  remark: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
