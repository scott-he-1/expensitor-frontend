import {
  deleteExpense,
  getUserExpenses,
  updateExpense,
} from "./services/client";
import { useEffect, useState } from "react";
import { errorNotification } from "./services/notification";
import SidebarWithHeader from "./components/shared/SideBar";
import { Spinner, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { ExpenseItem } from "./components/expense/ExpenseItem";
import jwtDecode from "jwt-decode";
import { ExpenseType } from "./types";

export const Expense = () => {
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  const fetchUserExpenses = () => {
    setLoading(true);
    const token = localStorage.getItem("user_token");
    if (!token) {
      throw new Error("User not validated");
    }
    const user: { email: string; id: number; iat: number } = jwtDecode(token);
    if (user.id) {
      getUserExpenses(user.id)
        .then((res) => {
          setExpenses(res.data);
        })
        .catch((error) => {
          setError(error.response.data.message);
          errorNotification(error.code, error.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchUserExpenses();
  }, []);

  if (loading) {
    return (
      <SidebarWithHeader>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </SidebarWithHeader>
    );
  }

  if (error) {
    return (
      <SidebarWithHeader>
        <Text mt={5}>Ooops there was an error</Text>
      </SidebarWithHeader>
    );
  }

  if (expenses.length <= 0) {
    return (
      <SidebarWithHeader>
        <Text mt={5}>No expenses available</Text>
      </SidebarWithHeader>
    );
  }

  return (
    <SidebarWithHeader>
      <Wrap justify={"flex-start"} spacing={"20px"}>
        {expenses.map((expense, index) => {
          return (
            <ExpenseItem
              key={index}
              id={expense.id}
              description={expense.description}
              amount={expense.amount}
              datePurchased={expense.datePurchased}
              userId={expense.userId}
              deleteItem={() => deleteExpense(expense.id)}
              fetchUserExpenses={fetchUserExpenses}
            />
          );
        })}
      </Wrap>
    </SidebarWithHeader>
  );
};
