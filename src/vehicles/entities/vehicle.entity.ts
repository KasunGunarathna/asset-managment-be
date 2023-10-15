import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

enum FuelType {
  Petrol = 'Petrol',
  Diesel = 'Diesel',
  Electric = 'Electric',
  Hybrid = 'Hybrid',
  Other = 'Other',
}

enum TaxationClass {
  Personal = 'Personal',
  Corporate = 'Corporate',
}

@Entity('vehicles')
export class VehiclesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vehicle_number: string;

  @Column()
  vehicle_make: string;

  @Column()
  model: string;

  @Column({ type: 'enum', enum: FuelType })
  fuel_type: string;

  @Column()
  license_from: string;

  @Column()
  license_to: string;

  @Column()
  engine_number: string;

  @Column()
  allocated_location: string;

  @Column('int')
  yom: number;

  @Column('int')
  yor: number;

  @Column()
  chassi_number: string;

  @Column({ type: 'enum', enum: TaxationClass })
  taxation_class: string;

  @Column()
  wheel_size: string;

  @Column()
  battery_required: string;

  @Column()
  fuel_consume: number;

  @Column()
  date_of_tested: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
