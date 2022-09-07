import React from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocalStorageValue } from "@react-hookz/web";
import { equals, find } from "ramda";

import { Isin } from "../types";

const defaultValues = {
  isin: "",
};
const schema = yup
  .object({
    isin: yup.string().required("ISIN is required").max(12, "ISIN is too long"),
  })
  .required();

function IsinForm() {
  const form = useForm({ defaultValues, resolver: yupResolver(schema) });
  const toast = useToast();
  const [isins, setIsins] = useLocalStorageValue<undefined | Isin[]>(
    "isins",
    [],
    {
      initializeWithStorageValue: false,
    }
  );

  const handleOnSubmit = async (values: { isin: string }) => {
    try {
      if (isins) {
        const exists = find((item) => equals(item.id, values.isin), isins);
        if (exists) {
          form.setError("isin", { message: "ISIN already connected" });
        } else {
          setIsins([...isins, { id: values.isin }]);
          form.reset();
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        toast({
          description: err.message,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <form
      style={{ marginBottom: "var(--chakra-space-4)" }}
      onSubmit={form.handleSubmit(handleOnSubmit)}
    >
      <FormControl isInvalid={Boolean(form.formState.errors.isin)} mb="2">
        <FormLabel>Isin</FormLabel>
        <Input
          {...form.register("isin")}
          variant="filled"
          data-test-id="isin-input"
        />
        <FormHelperText>{form.formState.errors.isin?.message}</FormHelperText>
      </FormControl>
      <Button
        type="submit"
        width="full"
        colorScheme="blue"
        data-test-id="add-button"
      >
        Add
      </Button>
    </form>
  );
}

export default IsinForm;
