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

  @Column({ type: 'int' })
  number_of_stories: number;

  @Column({ default: null })
  photo: string;

  @Column()
  location: string;

  @Column({ type: 'int' })
  built_year: number;

  @Column({ type: 'enum', enum: BuildingCondition })
  @IsEnum(BuildingCondition)
  condition: string;

  @Column()
  remark: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
