export type id = number;
export type name = string;
export type role = 'booker' | 'viewer';

export interface User {
  id: id;
  name: name;
  role: role;
}
