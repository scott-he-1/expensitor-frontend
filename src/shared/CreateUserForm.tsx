import { Form, Formik, useField, FieldHookConfig } from "formik";
import Yup from "yup";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormLabel,
  Input,
  Select,
  Stack,
} from "@chakra-ui/react";
import { saveUser } from "../services/client";
import {
  successNotification,
  errorNotification,
} from "../services/notification";
import { useAuth } from "../context/AuthContext";

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

const MySelect = ({
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
      <Select {...field} {...props} />
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
              console.log(res);
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
                label="Name"
                name="name"
                type="text"
                placeholder="Jane"
              />

              <MyTextInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="jane@formik.com"
              />

              <MyTextInput
                label="Age"
                name="age"
                type="number"
                placeholder="20"
              />

              <MyTextInput
                label="Password"
                name="password"
                type="password"
                placeholder={"pick a secure password"}
              />

              <MySelect label="Gender" name="gender">
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </MySelect>

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
