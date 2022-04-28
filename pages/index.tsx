import Link from "next/link";
import {
  useGetUsersQuery,
} from "@/graphql/generated/graphql";
import { useAuth } from "@/providers/auth";
import { Box, Button, Center, Container, Heading, Text, Tab, TabList, Tabs, FormControl, FormLabel, Input, FormErrorMessage, Select } from "@chakra-ui/react";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { Formik, Form, Field } from 'formik';


function FormikExample() {
  function validateName(value) {
    let error
    if (!value) {
      error = 'Name is required'
    } else if (value.toLowerCase() !== 'naruto') {
      error = "Jeez! You're not a fan 😱"
    }
    return error
  }

  return (
    <Formik
      initialValues={{ name: 'Sasuke' }}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
          actions.setSubmitting(false)
        }, 1000)
      }}
    >
      {(props) => (
        <Form>
          <Field name='name' validate={validateName}>
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.name && form.touched.name}>
                <FormLabel htmlFor='name'>First name</FormLabel>
                <Input {...field} id='name' placeholder='name' />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Button
            mt={4}
            colorScheme='teal'
            isLoading={props.isSubmitting}
            type='submit'
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  )
}

const CreateRequest = () => {
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
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            actions.setSubmitting(false)
          }, 1000)
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
            ? <CreateRequest/>
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
