/* eslint-disable prettier/prettier */
import { Entity, ObjectId, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: new Date().toISOString() })
  created_at: Date;

  @Column({ default: new Date().toISOString() })
  updated_at: Date;
}