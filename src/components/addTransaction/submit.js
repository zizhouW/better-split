import { getDatabase, set, ref, runTransaction } from "firebase/database";
import config from "../../firebase";
import { normalizeEmail } from "../../utils/normalizeEmail";
import { getToken } from "../../utils/localStorage";

export const addTransaction = async ({ name, year, month, day, amount, splits }) => {
  const db = getDatabase(config);
  const token = getToken();
  if (!token) throw new Error('You are not logged in.');
  if (!(name && year && month && day && amount && splits)) throw new Error('Invalid transaction details.');
  if (!Object.keys(splits).length) throw new Error('Invalid transaction details.');

  const id = new Date().toISOString().replace(/\./g, '');
  const currentUserId = normalizeEmail(token);

  await set(ref(db, 'transactions/' + id), {
    name,
    year,
    month,
    day,
    amount,
    creator: currentUserId,
    splits,
  });

  const currentUserRef = ref(db, `/users/${currentUserId}`);
  await runTransaction(currentUserRef, (currentUser) => {
    if (currentUser) {
      const currentUserOweings = currentUser.oweing;
      Object.entries(splits).forEach(([email, value]) => {
        if (!currentUserOweings[email]) {
          currentUserOweings[email] = -value;
        } else {
          currentUserOweings[email] -= value;
        }
      });
    }
    return currentUser;
  });

  const userTransactions = Object.entries(splits).map(([email, value]) => {
    const userRef = ref(db, `/users/${email}`);
    return runTransaction(userRef, (user) => {
      if (user) {
        const userOweings = user.oweing;
        if (!userOweings[currentUserId]) {
          userOweings[currentUserId] = value;
        } else {
          userOweings[currentUserId] += value;
        }
      }

      return user;
    })
  });

  await Promise.all(userTransactions);

  return true;
};
