import React from "react";
import {
  Box,
  Text,
  Divider,
  Stack,
  Button,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";
import { useLocalStorageValue } from "@react-hookz/web";
import { and, equals, filter } from "ramda";
import { FiPause, FiPlay, FiTrash2 } from "react-icons/fi";

import useWebSocket from "../hooks/useWebSocket";

import { Isin } from "../types";

const URL = "ws://159.89.15.214:8080/";

type Props = {
  id: string;
};

const IsinDetails = (props: Props) => {
  const { id } = props;
  const { send, isReady, val, readyState } = useWebSocket(URL);
  const toast = useToast();
  const [isins, setIsins] = useLocalStorageValue<undefined | Isin[]>(
    "isins",
    [],
    {
      initializeWithStorageValue: false,
    }
  );
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (and(isReady, !val)) {
      send(JSON.stringify({ subscribe: id }));
    }
  }, [isReady, val, id, send]);

  const handleOnDelete = () => {
    if (isins) {
      send(JSON.stringify({ unsubscribe: id }));
      const nextIsins = filter((item) => item.id !== id, isins);
      setIsins(nextIsins);
      toast({
        description: `Isin ${id} deleted`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const togglePause = () => {
    if (isPaused) {
      send(JSON.stringify({ subscribe: id }));
      setIsPaused(false);
    } else {
      send(JSON.stringify({ unsubscribe: id }));
      setIsPaused(true);
    }
  };

  return (
    <Box mb="4">
      {equals(readyState, WebSocket.CLOSED) ? (
        <Alert status="error" mb="2" borderRadius="md">
          <AlertIcon />
          ISIN is disconnected
        </Alert>
      ) : null}
      <Text>ISIN: {val?.isin}</Text>
      <Text>Price: {val?.price}</Text>
      <Text>Bid: {val?.bid}</Text>
      <Divider marginY="2" />
      <Stack>
        <Button
          leftIcon={isPaused ? <FiPlay /> : <FiPause />}
          size="sm"
          variant="ghost"
          onClick={togglePause}
        >
          {isPaused ? "Play" : "Pause"}
        </Button>
        <Button
          leftIcon={<FiTrash2 />}
          size="sm"
          variant="ghost"
          onClick={handleOnDelete}
        >
          Delete
        </Button>
      </Stack>
    </Box>
  );
};

export default IsinDetails;
