import { deleteExpense, getUserExpenses } from "./services/client";
import { useEffect, useState, useRef } from "react";
import { errorNotification } from "./services/notification";
import SidebarWithHeader from "./components/shared/SideBar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Spinner,
  Text,
  Wrap,
  useDisclosure,
} from "@chakra-ui/react";
import { ExpenseItem } from "./components/expense/ExpenseItem";
import jwtDecode from "jwt-decode";
import { ExpenseType } from "./types";
import { CreateExpenseTemplate } from "./components/expense/CreateExpenseTemplate";

export const Expense = () => {
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const {
    isOpen: isOpenNewExpenseModal,
    onOpen: onOpenNewExpenseModal,
    onClose: onCloseNewExpenseModal,
  } = useDisclosure();
  const cancelRef = useRef<any>();

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
          errorNotification(error, error.response.data.message);
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
        <Text mt={5}>Something went wrong</Text>
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
      <Button
        pos={"fixed"}
        bottom={"10%"}
        right={"5%"}
        width={50}
        height={50}
        title="New Expense"
        backgroundColor={"green"}
        onClick={onOpenNewExpenseModal}
      >
        +
      </Button>
      {isOpenNewExpenseModal ? (
        <AlertDialog
          isOpen={isOpenNewExpenseModal}
          leastDestructiveRef={cancelRef}
          onClose={onCloseNewExpenseModal}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <CreateExpenseTemplate
                onCloseNewExpenseModal={onCloseNewExpenseModal}
                fetchUserExpenses={fetchUserExpenses}
              />
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      ) : null}
    </SidebarWithHeader>
  );
};
