import { useEffect, useState } from "react";

const database = getDatabase(config);
const transactionsRef = ref(database, "transactions");
const token = getToken();

export const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {

  }, []);
};
