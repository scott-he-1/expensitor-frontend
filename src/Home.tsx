import SidebarWithHeader from "./components/shared/SideBar";
import { Text } from "@chakra-ui/react";

export const Home = () => {
  return (
    <SidebarWithHeader>
      <Text fontSize={"6xl"}>Dashboard</Text>
    </SidebarWithHeader>
  );
};
