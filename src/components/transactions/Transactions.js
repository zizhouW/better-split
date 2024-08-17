import { AbsoluteCenter, Box, Divider, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchTransactions } from "./fetch";
import './Transactions.css';
import { renderEmpty, renderError, renderLoading } from "./templates";
import { TransactionGroup } from "./TransactionGroup";

export const Transactions = ({ refreshTransactions }) => {
  const toast = useToast();

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchError, setIsFetchError] = useState(false);

  const fetch = () => {
    setIsLoading();
    fetchTransactions().then((res) => {
      setTransactions(res);
    }).catch(() => {
      setIsFetchError(true);
      toast({
        title: 'Failed to fetch expenses.',
        description: 'Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }).finally(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    fetch();
  }, [refreshTransactions]);

  const renderTransactions = () => (
    <>
      <TransactionGroup transactions={transactions} />
      <Box position='relative' padding="200px" pt="200px">
        <Divider />
        <AbsoluteCenter px='16px' color="gray.400" bg="gray.800" fontSize="14px">
          no more
        </AbsoluteCenter>
      </Box>
    </>

  );

  let render = renderLoading;
  if (isFetchError) {
    render = renderError;
  } else if (!isLoading && transactions.length) {
    render = renderTransactions;
  } else if (!isLoading) {
    render = renderEmpty;
  }

  return (
    <Box py="12px" px="16px" h="100%" overflowY="scroll">
      {render()}
    </Box>
  )
};
