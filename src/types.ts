export type User = {
  email: string;
  password: string;
};

export type ExpenseType = {
  id: number;
  description: string;
  amount: number;
  datePurchased: string;
  userId: number;
};

export type SaveExpense = {
  description: string;
  amount: number;
  datePurchased: string;
};

export type AuthContextType = {
  user: string | null;
  userId: number | null;
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
