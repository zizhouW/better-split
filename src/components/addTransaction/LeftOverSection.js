import { Box, Fade, Text, useDisclosure } from "@chakra-ui/react";
import { dollar } from "../../utils/dollar";
import { useEffect } from "react";
import { CheckIcon } from "@chakra-ui/icons";

export const LeftOverSection = ({ amount, leftover, splitMap }) => {
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    onToggle();

    return () => {
      onToggle();
    };
  }, []);

  if (!leftover && amount && Object.keys(splitMap).length) {
    return (
      <Box display="flex" alignItems="center" gap="8px">
        <CheckIcon color="#81c995" />
        <Text as="b">No outstanding amount!🎉</Text>
      </Box>
    );
  }

  if (!leftover) return null;
  
  return (
    <Fade in={isOpen}>
      <Text as="div" mb="4px" color="gray.300" fontSize="14px" lineHeight="16px">
        Outstanding amount (just for info, no need to balance it out):
      </Text>
      <Text color={leftover > 0 ? '#81c995' : '#f28b82'}>
        {dollar(Math.round(leftover * 100) / 100, false)}
      </Text>
    </Fade>
  );
};
