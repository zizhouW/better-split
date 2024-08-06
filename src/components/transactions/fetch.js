import config from "../../firebase"; // Assuming the correct path to your configuration file
import { getDatabase, ref, onValue } from "firebase/database";
import { throttle } from "lodash";

const database = getDatabase(config);
const transactionsRef = ref(database, "transactions");

export const fetchTransactions = throttle(() => {
  return new Promise((resolve, reject) => {
    onValue(transactionsRef, (snapshot) => {
      const transactionsMap = snapshot.val();
      if (transactionsMap) {
        const entries = Object.entries(transactionsMap);
        const sorted = entries.sort((a, b) => {
          const [timestampA, transactionA] = a;
          const [timestampB, transactionB] = b;
          if (timestampA > timestampB) {
            return -1;
          }
          return 1;
        })
        resolve(sorted.map(([timestamp, transaction]) => {
          return {
            ...transaction,
            timestamp,
          };
        }));
      }
      reject('Failed to fetch transactions.');
    });
  });
}, 100);
