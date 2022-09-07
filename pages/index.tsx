import React from "react";
import {
  Box,
  Center,
  Container,
  Flex,
  Grid,
  Heading,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useLocalStorageValue } from "@react-hookz/web";
import { map, filter, includes } from "ramda";

import { Isin } from "../types";

import constants from "../lib/constants";

import IsinForm from "../components/IsinForm";
import ColorModeToggle from "../components/ColorModeToggle";
import IsinDetails from "../components/IsinDetails";
import IsinTag from "../components/IsinTag";

const Home: NextPage = () => {
  const [isins, setIsins] = useLocalStorageValue<undefined | Isin[]>(
    "isins",
    [],
    {
      initializeWithStorageValue: false,
    }
  );
  const hasIsins = isins?.length;
  const gridTemplateColumns = [
    "1fr",
    "1fr",
    `1fr ${hasIsins ? "365px" : "auto"}`,
  ];
  const borderColor = useColorModeValue(
    "rgba(0,0,0,0.1)",
    "rgba(255,255,255,0.1)"
  );
  const filteredCommon = isins
    ? filter(
        (item) =>
          !includes(
            item.id,
            map((isin) => isin.id, isins)
          ),
        constants.COMMON_ISINS
      )
    : [];

  const handleOnAdd = (id: string) => {
    if (isins) {
      setIsins([...isins, { id }]);
    }
  };

  return (
    <Grid
      height={["auto", "auto", "100vh"]}
      gridTemplateColumns={gridTemplateColumns}
    >
      <Center paddingTop="16">
        <Container>
          <Box>
            <Heading fontSize="2xl" mb="4" textAlign="center">
              Republic Tracker
            </Heading>
            <IsinForm />
            <Stack spacing="2" direction={["column", "column", "row"]}>
              {map(
                (item) => (
                  <IsinTag
                    key={item.id}
                    id={item.id}
                    icon={item.icon}
                    label={item.label}
                    onClick={handleOnAdd}
                  />
                ),
                filteredCommon
              )}
            </Stack>
          </Box>
        </Container>
      </Center>
      {hasIsins ? (
        <Container
          overflowY="auto"
          paddingY="4"
          borderLeft={["none", "none", `1px solid ${borderColor}`]}
          style={{ scrollbarWidth: "thin" }}
        >
          <Flex mb="4" justifyContent="space-between" alignItems="center">
            <Heading fontSize="xl">ISINs</Heading>
          </Flex>
          {map(
            (item) => (
              <IsinDetails key={item.id} id={item.id} />
            ),
            isins
          )}
        </Container>
      ) : null}
      <ColorModeToggle />
    </Grid>
  );
};

export default Home;
