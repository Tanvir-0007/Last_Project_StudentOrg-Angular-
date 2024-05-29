import {Subject} from "./subject.model";

export interface Student {
  id?: number;
  name: string;
  roll: string;
  email: string;
  dateOfBirth: string;
  subjects?: Subject[];
}
