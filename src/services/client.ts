import axios from "axios";
import { User } from "../types";
import { SaveExpense } from "../types";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("user_token")}`,
  },
});

export const saveUser = async (user: User) => {
  try {
    return await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user`, user);
  } catch (e) {
    throw e;
  }
};

export const updateUser = async (id: number, password: string) => {
  try {
    return await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/user/${id}`,
      password,
      getAuthConfig()
    );
  } catch (e) {
    throw e;
  }
};

export const deleteUser = async (id: number) => {
  try {
    return await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/user/${id}`,
      getAuthConfig()
    );
  } catch (e) {
    throw e;
  }
};

export const login = async (emailAndPassword: {
  email: string;
  password: string;
}) => {
  try {
    return await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
      emailAndPassword
    );
  } catch (e) {
    throw e;
  }
};

export const getUserExpenses = async (userId: number) => {
  try {
    return await axios.get(
      `${import.meta.env.VITE_API_DATA_URL}/user/${userId}/expenses`,
      getAuthConfig()
    );
  } catch (e) {
    throw e;
  }
};

export const getExpense = async (expenseId: number) => {
  try {
    return await axios.get(`${import.meta.env.VITE_API_DATA_URL}/${expenseId}`);
  } catch (e) {
    throw e;
  }
};

export const saveExpense = async (expense: SaveExpense) => {
  try {
    return await axios.post(
      `${import.meta.env.VITE_API_DATA_URL}/expense`,
      expense
    );
  } catch (e) {
    throw e;
  }
};

export const updateExpense = async (
  expenseId: number,
  expense: SaveExpense
) => {
  try {
    return await axios.put(
      `${import.meta.env.VITE_API_DATA_URL}/${expenseId}`,
      expense
    );
  } catch (e) {
    throw e;
  }
};

export const deleteExpense = async (expenseId: number) => {
  try {
    return await axios.delete(
      `${import.meta.env.VITE_API_DATA_URL}/${expenseId}`
    );
  } catch (e) {
    throw e;
  }
};
