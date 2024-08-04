import React, { useEffect, useState } from "react";
import { useNavigate  } from "react-router-dom";
import config from "../../firebase"; // Assuming the correct path to your configuration file
import { getDatabase, ref, onValue } from "firebase/database";
import './Dashboard.css';
import { getToken, removeToken } from "../../utils/localStorage";
import { Button, useToast } from "@chakra-ui/react";

function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();

  const navigateToLogin = () => {
    navigate("/login");
  }

  const isLoggedIn = () => {
    const token = getToken();

    return !!token;
  }

  useEffect(() => {
    if (!isLoggedIn()) {
      setTimeout(() => {
        navigateToLogin();
      }, 1000);
    }
  }, []);

  const logout = () => {
    removeToken();
    toast({
      title: 'Successfully logged out',
      description: 'You\'ll be redirected soon...',
      status: 'success',
      duration: 3000,
      isClosable: true,
      onCloseComplete: () => navigate('/login'),
    });
  }

  // // Initialize the Firebase database with the provided configuration
  // const database = getDatabase(config);
  
  // // Reference to the specific collection in the database
  // const collectionRef = ref(database, "users");

  // // Function to fetch data from the database
  // const fetchData = () => {
  //   // Listen for changes in the collection
  //   onValue(collectionRef, (snapshot) => {
  //     const dataItem = snapshot.val();
  //     // Check if dataItem exists
  //     if (dataItem) {
  //       // Convert the object values into an array
  //       const displayItem = Object.values(dataItem);
  //       setData(displayItem);
  //     }
  //   });
  // };

  // // Fetch data when the component mounts
  // fetchData();

  if (!isLoggedIn()) {
    return (
      <div className="loading">
        <img src="/loading.gif" alt="Loading..."/>
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <Button colorScheme="blue" onClick={logout}>Log out</Button>
    </div>
  );
}

export default Dashboard;
