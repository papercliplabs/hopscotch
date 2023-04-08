import { Button, Center, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import NotFound from "@/public/static/NotFound.svg";

export default function Custom404() {
  return (
    <Center flexDirection="column" alignItems="center" mt={4} height="70vh">
      <Image src={NotFound} alt="not found" />
      <Text textStyle="headline" mt={3} mb={6}>Page not found</Text>
      <Link href="/" passHref>
        <Button
          type="submit"
          size="lg"
          variant="primary"
        >
          Create a request
        </Button>
      </Link>
    </Center>
  )
}