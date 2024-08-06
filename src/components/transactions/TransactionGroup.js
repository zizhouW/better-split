import { useEffect, useState } from "react";
import { getMonthName } from "../../utils/date";
import { Accordion, Box, Text } from "@chakra-ui/react";
import { Transaction } from "./Transaction";

export const TransactionGroup = ({ transactions }) => {
  const [groups, setGroups] = useState({});

  useEffect(() => {
    const processGroups = {};
    transactions.forEach((transaction) => {
      // key: YYYY-MM
      const key = transaction.timestamp.substr(0, 7);
      if (!processGroups[key]) {
        processGroups[key] = [];
      }
      processGroups[key].push(transaction);
    });

    setGroups(processGroups);
  }, transactions);

  const entries = Object.entries(groups);

  return entries.map(([key, transactions]) => {
    const [year, month] = key.split('-');
    const monthName = getMonthName(parseInt(month) - 1);
    return (
      <Box>
        <Text fontSize="20px" fontWeight="bold" py="4px" pl="8px" bg="gray.700">
          {monthName}&nbsp;{year}
        </Text>
        <Accordion allowMultiple allowToggle>
          {transactions.map((transaction) => (
            <Transaction transaction={transaction} />
          ))}
        </Accordion>
      </Box>
    );
  });
};
