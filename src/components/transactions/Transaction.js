import { HamburgerIcon } from "@chakra-ui/icons";
import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Avatar, Box, Card, CardBody, Stack, Text } from "@chakra-ui/react";
import { capitalize } from "lodash";
import { getUser } from "../../utils/users";
import { getMonthName } from "../../utils/date";
import { dollar } from "../../utils/dollar";

const defaultUser = {
  name: 'User',
};

export const Transaction = ({ transaction }) => {
  const creatorUser = getUser(transaction.creator);

  const renderEventDate = () => {
    const ts = transaction.timestamp;
    const transactionDate = new Date(ts.substr(0, ts.length - 4));
    const eventDate = new Date(transaction.year, transaction.month, transaction.day);

    return (
      <Box fontSize="14px" color="gray.400" display="flex" flexWrap="wrap">
        <Box display="flex" alignItems="center" flexWrap="wrap">
          <Text as="span">Logged by&nbsp;&nbsp;</Text>
          <Avatar name={creatorUser.name} size="2xs" />&nbsp;&nbsp;
          <Text as="span" fontWeight="bold" color="gray.200">
            {creatorUser.name}
          </Text>
          &nbsp;on&nbsp;
          <Text as="span" color="gray.200" fontWeight="bold">
            {getMonthName(transactionDate.getMonth())}&nbsp;
            {transactionDate.getDate()},&nbsp;
            {transactionDate.getFullYear()}
          </Text>.&nbsp;
        </Box>
        <Box>
          <Text as="span">
            The expense took place on&nbsp;
          </Text>
          <Text as="span" color="gray.200" fontWeight="bold">
            {getMonthName(eventDate.getMonth() - 1)}&nbsp;
            {eventDate.getDate()},&nbsp;
            {eventDate.getFullYear()}
          </Text>.
        </Box>
      </Box>
    );
  };

  const renderUserOweing = ({ user, amount }) => {
    const userFallback = user || defaultUser;

    return (
      <Box display="flex">
        <Box minW="40px">
          <Avatar name={userFallback.name} />
        </Box>
        <Box display="flex" flexDir="column" ml="8px">
          <Text>{userFallback.name}</Text>
          <Text color="#81c995" fontWeight="bold">
            Owes {dollar(amount)}
          </Text>
        </Box>
      </Box>
    )
  };

  const renderEventDetails = () => {
    const entries = Object.entries(transaction.splits);
    return (
      <Card mt="12px">
        <CardBody pt="8px" pb="12px">
          <Text as="span" fontWeight="bold">
            {creatorUser.name}&nbsp;
          </Text>
          <Text as="span">
            requested the following:
          </Text>
          <Stack mt="8px" direction={['column', 'row']} spacing='24px'>
            {entries.map(([id, amount]) => {
              return renderUserOweing({
                user: getUser(id),
                amount,
              });
            })}
          </Stack>
        </CardBody>
      </Card>
    );
  };

  return (
    <AccordionItem>
      <Box py="8px">
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left" display="flex" alignItems="center" fontSize="20px">
            <HamburgerIcon mr="8px" />
            {capitalize(transaction.name)}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </Box>
      <AccordionPanel pt={0}>
        <Box>
          {renderEventDate()}
          {renderEventDetails()}
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
};
