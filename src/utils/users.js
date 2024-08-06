import config from "../firebase"; // Assuming the correct path to your configuration file
import { getDatabase, ref, onValue } from "firebase/database";
import { normalizeEmail } from "./normalizeEmail";
import { getToken } from "./localStorage";
import { throttle } from "lodash";

let usersCache = [];
let usersRecord = {};
let currentUser = null;

const database = getDatabase(config);
const usersRef = ref(database, "users");

export const fetchUsers = throttle(() => {
  const token = getToken();

  return new Promise((resolve, reject) => {
    onValue(usersRef, (snapshot) => {
      const usersMap = snapshot.val();
      if (usersMap) {
        const normalizedEmail = normalizeEmail(token);
        if (usersMap[normalizedEmail]) {
          setCurrentUser(usersMap[normalizedEmail]);
        }
        
        usersRecord = usersMap;
        const usersInfo = Object.values(usersMap);
        setUsers(usersInfo);
        resolve();
      }
      reject();
    });
  });
}, 100);

export const setUsers = (users) => {
  usersCache = users;
};

export const getUsers = async () => {
  await fetchUsers();
  return usersCache;
};

export const setCurrentUser = (userInfo) => {
  currentUser = userInfo;
};

export const getCurrentUser = async () => {
  await fetchUsers();
  return currentUser;
};

export const getUser = (id) => {
  return usersRecord[id];
};
