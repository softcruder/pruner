/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';

export interface User extends Document {
  readonly username: string;
  readonly password: string;
}