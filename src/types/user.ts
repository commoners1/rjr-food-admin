export interface User {
  id: string;
  name: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
  isActive: boolean;
  division: {
    id: string;
    name: string;
  };
  avatar?: string | null;
  managerId?: string;
  password?: string;
  status?: string;
}

