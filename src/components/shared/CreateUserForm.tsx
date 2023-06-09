import { Form, Formik, useField, FieldHookConfig } from "formik";
import * as Yup from "yup";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import { saveUser } from "../../services/client";
import {
  successNotification,
  errorNotification,
} from "../../services/notification";

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
  const [field, meta] = useField(props);
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

export const CreateUserForm = ({
  onSuccess,
}: {
  onSuccess: (token: string) => void;
}) => {
  return (
    <>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Must be 20 characters or less")
            .required("Required"),
          password: Yup.string()
            .min(4, "Must be 4 characters or more")
            .max(15, "Must be 15 characters or less")
            .required("Required"),
        })}
        onSubmit={(user, { setSubmitting }) => {
          setSubmitting(true);
          saveUser(user)
            .then((res) => {
              successNotification(
                "User saved",
                `${user.email} was successfully saved`
              );
              onSuccess(res.headers["authorization"]);
            })
            .catch((err) => {
              console.log(err);
              errorNotification(err.code, err.response.data.message);
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {({ isValid, isSubmitting }) => (
          <Form>
            <Stack spacing={"24px"}>
              <MyTextInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="johndoe@email.com"
                props={""}
              />

              <MyTextInput
                label="Password"
                name="password"
                type="password"
                placeholder={"pick a secure password"}
                props={""}
              />

              <Button disabled={!isValid || isSubmitting} type="submit">
                Submit
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </>
  );
};
