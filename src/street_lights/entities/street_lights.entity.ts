import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

enum PoleType {
  Concrete = 'Concrete',
  Steel = 'Steel',
}

enum LampType {
  LED = 'LED',
  CFL = 'CFL',
  Filament = 'Filament',
  Halogen = 'Halogen',
}

@Entity('street_lights')
export class StreetLightEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pole_number: string;

  @Column()
  road_name: string;

  @Column()
  wire_condition: string;

  @Column()
  switch_condition: string;

  @Column({ type: 'enum', enum: PoleType })
  pole_type: PoleType;

  @Column({ type: 'enum', enum: LampType })
  lamp_type: LampType;

  @Column({ default: null })
  photo: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
