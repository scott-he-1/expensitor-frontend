import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Flex, Heading, Link, Stack } from "@chakra-ui/react";
import { CreateUserForm } from "../shared/CreateUserForm";

export const SignUp = () => {
  const { user, setUserFromToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  });

  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} alignItems={"center"} justifyContent={"center"}>
        <Stack spacing={4} w={"full"} maxW={"md"}>
          <Heading fontSize={"2xl"} mb={15}>
            Register for an account
          </Heading>
          <CreateUserForm
            onSuccess={(token: string) => {
              localStorage.setItem("user_token", token);
              setUserFromToken();
              navigate("/dashboard");
            }}
          />
          <Link color={"blue.500"} href={"/"}>
            Have an account? Login now.
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
