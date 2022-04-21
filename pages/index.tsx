import Link from "next/link";
import {
  useGetUsersQuery,
} from "@/graphql/generated/graphql";
import { useAuth } from "@/providers/auth";
import { Box, Button, Center, Container, Heading, Tab, TabList, Tabs } from "@chakra-ui/react";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";

const EmptyState = () => {
  return (
    <Box>
      <Heading size="xl" mb={4}>
        EMPTY STATE
      </Heading>
    </Box>
  );
};

const LoginState = () => {
  return (
    <Center flexDirection="column">
      <Heading size="md" mb={4}>
        Please Login
      </Heading>
      <ConnectWalletButton />
    </Center>
  );
};

const Index = () => {
  const { user } = useAuth();
  const { data: allUsersData } = useGetUsersQuery();
  console.log("Example page data:", allUsersData);

  return (
    <Container width="100%" height="100vh" maxW="832px">
      <Heading size="2xl" mb={4}>
        Requests
      </Heading>
      <Center height="60%">
        {
          user
            ? <EmptyState/>
            : <LoginState/>
        }
      </Center>

    </Container>
  );
};

const DashboardNavigation = () => {
  return (
    <Tabs variant='soft-rounded' colorScheme='blackWhite'>
      <TabList>
        <Tab>Requests</Tab>
        <Tab>Contacts</Tab>
      </TabList>
    </Tabs>
  )
}

Index.NavElement = DashboardNavigation;

export default Index;
