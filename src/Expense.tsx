import { getUserExpenses } from "./services/client";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { errorNotification } from "./services/notification";
import SidebarWithHeader from "./shared/SideBar";
import { Spinner, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { ExpenseItem } from "./expense/ExpenseItem";

export const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const { userId } = useAuth();

  const fetchUserExpenses = () => {
    setLoading(true);
    if (userId) {
      getUserExpenses(userId)
        .then((res) => setExpenses(res.data))
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
      <Wrap justify={"center"} spacing={"30px"}>
        {expenses.map((expense, index) => (
          <WrapItem key={index}>
            <div>{expense}</div>
            <ExpenseItem />
          </WrapItem>
        ))}
      </Wrap>
    </SidebarWithHeader>
  );
};
