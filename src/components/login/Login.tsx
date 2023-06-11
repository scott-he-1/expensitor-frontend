import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Formik, Form, useField, FieldHookConfig } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext.js";
import { errorNotification } from "../../services/notification.js";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <Formik
      validateOnMount={true}
      validationSchema={Yup.object({
        email: Yup.string()
          .email("Must be valid email")
          .required("Email is required"),
        password: Yup.string()
          .max(20, "Password cannot be more than 20 characters")
          .required("Password is required"),
      })}
      initialValues={{ email: "", password: "" }}
      onSubmit={(
        values: { email: string; password: string },
        { setSubmitting }
      ) => {
        setSubmitting(true);
        login(values)
          .then(() => {
            navigate("/dashboard");
          })
          .catch((err) => {
            errorNotification(err.code, err.response.data.message);
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      {({ isValid, isSubmitting }) => (
        <Form>
          <Stack mt={15} spacing={15}>
            <MyTextInput
              label={"Email"}
              name={"email"}
              type={"email"}
              placeholder={"johndoe@email.com"}
              props={""}
            />
            <MyTextInput
              label={"Password"}
              name={"password"}
              type={"password"}
              placeholder={"Type your password"}
              props={""}
            />

            <Button type={"submit"} disabled={!isValid || isSubmitting}>
              Login
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard/users");
    }
  });

  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} alignItems={"center"} justifyContent={"center"}>
        <Stack spacing={4} w={"full"} maxW={"md"}>
          <Text
            fontSize={50}
            fontWeight={"bold"}
            fontFamily={"sans-serif"}
            color={"rgba(255,100,100,1)"}
            userSelect={"none"}
          >
            Expensitor
          </Text>
          <Heading fontSize={"2xl"} mb={15}>
            Sign in to your account
          </Heading>
          <LoginForm />
          <Link color={"blue.500"} href={"/signup"}>
            Dont have an account? Signup now.
          </Link>
        </Stack>
      </Flex>
      <Flex
        flex={1}
        p={10}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        bgGradient={{ sm: "linear(to-r, blue.600, purple.600)" }}
      ></Flex>
    </Stack>
  );
};