import Link from "next/link";
import {
  useInsertInvoiceMutation,
  useGetInvoiceQuery,
} from "@/graphql/generated/graphql";
import { useAuth } from "@/providers/auth";
import { Box, Button, Center, Container, Heading, Text, Tab, TabList, Tabs, FormControl, FormLabel, Input, FormErrorMessage, Select } from "@chakra-ui/react";
import { useRouter } from "next/router";

const RequestPage = () => {
  const {query} = useRouter();
  const id = query.id
  const { data, loading, error } = useGetInvoiceQuery({variables: {id}, skip: !id});
  console.log("data", {data, loading, error})
  return (
    <Container width="100%" height="100vh" maxW="832px">
      <Heading size="2xl" mb={4}>
        Request {id}
      </Heading>
      <Center height="60%">
        {
        loading
          ? <Text>Loading...</Text>
          : <Text>{JSON.stringify(data)}</Text>
        }
      </Center>

    </Container>
  );
};

export default RequestPage;