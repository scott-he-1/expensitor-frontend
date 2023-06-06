export type User = {
  email: string;
  password: string;
};

export type Expense = {
  id: number;
  description: string;
  amount: number;
  datePurchased: number;
  userId: number;
};

export type AuthContextType = {
  user: string | null;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<unknown>;
  logOut: () => void;
  isUserAuthenticated: () => boolean;
  setUserFromToken: () => void;
};
