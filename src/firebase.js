// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: "better-split-32aa5.firebaseapp.com",
  databaseURL: "https://better-split-32aa5-default-rtdb.firebaseio.com",
  projectId: "better-split-32aa5",
  storageBucket: "better-split-32aa5.appspot.com",
  messagingSenderId: "571250421824",
  appId: "1:571250421824:web:74a9bd728d8e5aae6eafa5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
