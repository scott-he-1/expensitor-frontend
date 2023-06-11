import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Center,
  Flex,
  Text,
  useDisclosure,
  Input,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { AxiosResponse } from "axios";
import {
  errorNotification,
  successNotification,
} from "../../services/notification";
import { useRef, useState } from "react";
import { FieldHookConfig, Form, Formik, useField } from "formik";
import * as Yup from "yup";
import { updateExpense } from "../../services/client";

export const ExpenseItem = ({
  id,
  description,
  amount,
  datePurchased,
  deleteItem,
  fetchUserExpenses,
}: {
  id: number;
  description: string;
  amount: number;
  datePurchased: string;
  userId: number;
  deleteItem: (userId: number) => Promise<AxiosResponse<any, any>>;
  fetchUserExpenses: () => void;
}) => {
  const {
    isOpen: isOpenDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();
  const {
    isOpen: isOpenResponsiveEditModal,
    onOpen: onOpenResponsiveEditModal,
    onClose: onCloseResponsiveEditModal,
  } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const cancelRef = useRef<any>();

  const TextInput = ({
    ...props
  }: {
    name: string;
    type: string;
    props: string | FieldHookConfig<any>;
  }) => {
    const [field, meta] = useField(props);
    return (
      <>
        <Input {...field} {...props} />
        {meta.touched && meta.error ? (
          <Alert className="error" status={"error"}>
            <AlertIcon />
            {meta.error}
          </Alert>
        ) : null}
      </>
    );
  };

  const ExpenseEditForm = ({
    description,
    amount,
    datePurchased,
  }: {
    description: string;
    amount: number;
    datePurchased: string;
  }) => {
    return (
      <Formik
        initialValues={{
          description: description,
          amount: amount,
          datePurchased: datePurchased,
        }}
        validationSchema={Yup.object({
          description: Yup.string()
            .min(1, "Description cannot be blank")
            .max(80, "Description cannot go over 80 characters")
            .required("Description required"),
          amount: Yup.number().required("Amount required"),
          datePurchased: Yup.string().required("Date required"),
        })}
        onSubmit={(updatedExpense) => {
          updateExpense(id, {
            id,
            description: updatedExpense.description,
            amount: Number(updatedExpense.amount),
            datePurchased: updatedExpense.datePurchased,
          })
            .then(() => {
              successNotification(
                "Expense updated",
                `Expense was successfully updated`
              );
              fetchUserExpenses();
            })
            .catch((err) => {
              console.log(err);
              errorNotification(err.code, err.response.data.message);
            })
            .finally(() => {
              setIsEditing(false);
              onCloseResponsiveEditModal();
            });
        }}
      >
        <Form>
          <Flex gridGap={5} alignItems={"center"}>
            {window.innerWidth > 1000 ? (
              <>
                <TextInput name="description" type="text" props={""} />
                <TextInput name="amount" type="text" props={""} />
                <TextInput name="datePurchased" type="text" props={""} />
                <Button type="submit" fontSize={12} w={"50%"}>
                  Update
                </Button>
              </>
            ) : (
              <Flex flexDirection={"column"} gridGap={5}>
                <TextInput name="description" type="text" props={""} />
                <TextInput name="amount" type="text" props={""} />
                <TextInput name="datePurchased" type="text" props={""} />
                <Button type="submit">Update</Button>
                <Button onClick={onCloseResponsiveEditModal}>Cancel</Button>
              </Flex>
            )}
          </Flex>
        </Form>
      </Formik>
    );
  };

  return (
    <Center>
      <Box
        maxWidth={"1000px"}
        minWidth={"350px"}
        w={"50%"}
        boxShadow={"lg"}
        rounded={"md"}
        overflow={"hidden"}
        border={"1px"}
      >
        <Flex gridGap={5} alignItems={"center"} padding={2}>
          {!isEditing ? (
            <>
              <Text fontSize={12}>{description}</Text>
              <Text fontSize={12}>${amount}</Text>
              <Text fontSize={12}>{datePurchased}</Text>
              <Button
                fontSize={12}
                onClick={() => {
                  if (window.innerWidth < 1000) {
                    onOpenResponsiveEditModal();
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                Edit
              </Button>
            </>
          ) : (
            <ExpenseEditForm
              description={description}
              amount={amount}
              datePurchased={datePurchased}
            />
          )}
          <Button
            fontSize={12}
            onClick={onOpenDeleteModal}
            backgroundColor={"red"}
            disabled={isEditing}
          >
            Delete
          </Button>
          <AlertDialog
            isOpen={isOpenResponsiveEditModal}
            leastDestructiveRef={cancelRef}
            onClose={onCloseResponsiveEditModal}
          >
            <AlertDialogOverlay>
              <AlertDialogContent padding={5}>
                <ExpenseEditForm
                  description={description}
                  amount={amount}
                  datePurchased={datePurchased}
                />
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
          <AlertDialog
            isOpen={isOpenDeleteModal}
            leastDestructiveRef={cancelRef}
            onClose={onCloseDeleteModal}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Expense
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure you want to delete this expense? You can't undo
                  this action afterwards.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Flex gridGap={3}>
                    <Button ref={cancelRef} onClick={onCloseDeleteModal}>
                      Cancel
                    </Button>
                    <Button
                      background={"red"}
                      onClick={() =>
                        deleteItem(id)
                          .then(() => {
                            successNotification(
                              "DELETED",
                              "Expense was successfully deleted"
                            );
                            fetchUserExpenses();
                          })
                          .catch((e) => {
                            errorNotification(e.code, e.response.data.message);
                          })
                      }
                    >
                      Confirm
                    </Button>
                  </Flex>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Flex>
      </Box>
    </Center>
  );
};
