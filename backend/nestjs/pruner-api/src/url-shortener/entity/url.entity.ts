/* eslint-disable prettier/prettier */
import { Entity, ObjectId, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class Urls {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  short_id: string;

  @Column()
  long_url: string;

  @Column({ foreignKeyConstraintName: 'username' })
  username: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: new Date().toISOString() })
  created_at: Date;

  @Column({ default: new Date().toISOString() })
  updated_at: Date;
}