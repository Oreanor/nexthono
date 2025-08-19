export interface BaseUser {
  name: string;
  email: string;
  username: string;
  phone?: string;
  website?: string;
  company?: string;
}

export interface User extends BaseUser {
  id: number;
  createdAt?: Date;
}


