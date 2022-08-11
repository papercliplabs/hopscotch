import { Input } from "@chakra-ui/react";
import { useState } from "react";

export function NumberInput({
  placeholder,
  setNumCallback,
}: {
  placeholder: string;
  setNumCallback: (val: string) => void;
}) {
  const [num, setNum] = useState<string>("");
  return (
    <Input
      id="amount"
      placeholder={placeholder}
      variant="unstyled"
      fontSize="xl"
      onChange={(e) => {
        // Only decimal number inputs
        const regex = /^[0-9]*[.]?[0-9]*$/;
        if (e.target.value == "" || regex.test(e.target.value)) {
          setNum(e.target.value);
          setNumCallback(e.target.value);
        }
      }}
      value={num}
    />
  );
}
