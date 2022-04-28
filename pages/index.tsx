import Link from "next/link";
import {
  useInsertInvoiceMutation,
  useGetUsersQuery,
} from "@/graphql/generated/graphql";
import { useAuth } from "@/providers/auth";
import { Box, Button, Center, Container, Heading, Text, Tab, TabList, Tabs, FormControl, FormLabel, Input, FormErrorMessage, Select } from "@chakra-ui/react";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { Formik, Form, Field } from 'formik';
import { useRouter } from "next/router";


const CreateRequest = (props) => {
  const {user} = props;
  const router = useRouter();

  const [insertInvoice, {loading}] = useInsertInvoiceMutation();
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Heading size="xl" mb={2}>
        Create your request
      </Heading>
      <Text mb={4}>
        Get a link you can send anyone to pay you
      </Text>
      <Formik
        initialValues={{ amount: 0 }}
        onSubmit={(values, actions) => {
          console.log("creating", values)
          insertInvoice({
            variables: {
              object: {
                amount: parseInt(values.amount, 10),
                token_address: values.tokenAddress,
                user_id: user.id,
              }
            },
          }).then(({data}) => {
            console.log("response", data)
            const invoiceId = data?.insert_invoices_one?.id;
            router.push(`/request/${invoiceId}`);
          });
          actions.setSubmitting(false);
        }}
      >
        {(props) => (
          <Form>
            <Field name='amount'>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.amount && form.touched.amount}>
                  <FormLabel htmlFor='amount'>Amount</FormLabel>
                  <Input {...field} id='amount' placeholder='amount' />
                  <FormErrorMessage>{form.errors.amount}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name='tokenAddress'>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.tokenAddress && form.touched.tokenAddress}>
                  <FormLabel htmlFor='tokenAddress'>Token</FormLabel>
                  <Select {...field} placeholder='Select token'>
                    <option value='0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'>USDC</option>
                  </Select>
                  <FormErrorMessage>{form.errors.tokenAddress}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Button
              mt={4}
              colorScheme='teal'
              isLoading={props.isSubmitting}
              type='submit'
            >
              Create request link
            </Button>
          </Form>
        )}
      </Formik>
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
            ? <CreateRequest user={user}/>
            : <LoginState/>
        }
      </Center>

    </Container>
  );
};

export default Index;
