import { Form, Formik, useField, FieldHookConfig } from "formik";
import * as Yup from "yup";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import {
  successNotification,
  errorNotification,
} from "../../services/notification";
import { useState } from "react";
import { saveExpense } from "../../services/client";

export const CreateExpenseTemplate = ({
  onCloseNewExpenseModal,
  fetchUserExpenses,
}: {
  onCloseNewExpenseModal: () => void;
  fetchUserExpenses: () => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MyTextInput = ({
    label,
    ...props
  }: {
    label: string;
    name: string;
    type: string;
    placeholder: string;
    props: string | FieldHookConfig<any>;
  }) => {
    const [field, meta] = useField(props as string | FieldHookConfig<any>);
    return (
      <Box>
        <FormLabel htmlFor={props.name}>{label}</FormLabel>
        <Input className="text-input" {...field} {...props} />
        {meta.touched && meta.error ? (
          <Alert className="error" status={"error"} mt={2}>
            <AlertIcon />
            {meta.error}
          </Alert>
        ) : null}
      </Box>
    );
  };

  const createNewExpenseFields = [
    {
      label: "Description",
      name: "description",
      placeholder:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      type: "text",
    },
    { label: "Amount", name: "amount", placeholder: "99.99", type: "text" },
    {
      label: "Date Purchased",
      name: "datePurchased",
      placeholder: "March 7, 2023",
      type: "text",
    },
  ];

  return (
    <Box padding={5}>
      <Formik
        validateOnMount={true}
        initialValues={{ description: "", amount: 0, datePurchased: "" }}
        validationSchema={Yup.object({
          description: Yup.string().required(),
          amount: Yup.number().required(),
          datePurchased: Yup.string().required(),
        })}
        onSubmit={(values: {
          description: string;
          amount: number;
          datePurchased: string;
        }) => {
          setIsSubmitting(true);
          console.log(values);

          saveExpense({
            description: values.description,
            amount: Number(values.amount),
            datePurchased: values.datePurchased,
          })
            .then(() => {
              onCloseNewExpenseModal();
              fetchUserExpenses();
              successNotification("Success", "Expense successfully saved");
            })
            .catch((err) => {
              errorNotification(err.code, err.response.data.message);
            })
            .finally(() => setIsSubmitting(false));
        }}
      >
        <Form>
          <Flex flexDirection={"column"} gridGap={5}>
            {createNewExpenseFields.map((field) => (
              <MyTextInput
                label={field.label}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                props={""}
                key={field.name}
              />
            ))}
            <Button
              backgroundColor={"green"}
              disabled={isSubmitting}
              type="submit"
            >
              Confirm
            </Button>
            <Button backgroundColor={"red"} onClick={onCloseNewExpenseModal}>
              Cancel
            </Button>
          </Flex>
        </Form>
      </Formik>
    </Box>
  );
};
