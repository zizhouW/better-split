import { getDatabase, get, set, ref, child } from "firebase/database";
import config from "../../firebase";

const normalizeEmail = (email) => {
  return email.replace(/\./g, '');
};

const SIGN_UP_ERROR = 'This email has already signed up.';

export const signUp = async ({ username, email, password }) => {
  const db = getDatabase(config);
  const dbRef = ref(db);

  const normalizedEmail = normalizeEmail(email);

  // check if email already exists
  const snapshot = await get(child(dbRef, `users/${normalizedEmail}`));
  if (snapshot.exists()) {
    throw new Error(SIGN_UP_ERROR);
  }

  return set(ref(db, 'users/' + normalizedEmail), {
    username,
    email,
    password
  });
};

const LOGIN_ERROR = {
  msg: 'Invalid login credentials. Please try again',
};

export const login = ({ email, password }) => {
  const dbRef = ref(getDatabase(config));
  return new Promise((resolve, reject) => {
    get(child(dbRef, `users/${normalizeEmail(email)}`)).then((snapshot) => {
      const user = snapshot.val();
      if (!(snapshot.exists() && user.password === password)) {
        reject(LOGIN_ERROR);
        return;
      }
      if (user.password === password) {
        resolve(user);
      }
    });
  });
};
