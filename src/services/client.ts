import axios from "axios";
import { User } from "../types";

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
  console.log(emailAndPassword);

  try {
    return await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
      emailAndPassword
    );
  } catch (e) {
    throw e;
  }
};
