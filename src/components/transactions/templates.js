import { Box, Text } from "@chakra-ui/react";
import { Image } from "../image/Image";

export const renderEmpty = () => (
  <Box w="100%" display="flex" flexDir="column" justifyContent="center" alignItems="center">
    <Image class="empty" src="/empty.png" alt="empty" />
    <Text color="gray.300" fontSize="40px" fontWeight="bold">
      No expenses no far. Where is my money?
    </Text>
  </Box>
);

export const renderLoading = () => (
  <Box w="100%" display="flex">
    <Box m="auto" mt="100px">
      <Image src="/loading.gif" alt="Loading..."/>
    </Box>
  </Box>
);

export const renderError = () => (
  <Box w="100%" display="flex" flexDir="column" justifyContent="center" alignItems="center">
    <Image class="empty" src="/error.png" alt="empty" />
    <Text color="gray.300" fontSize="40px" fontWeight="bold">
      We ran into an error. Please try reloading.
    </Text>
  </Box>
);