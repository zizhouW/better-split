import React, { useEffect, useState } from "react";
import { useNavigate  } from "react-router-dom";
import config from "../../firebase"; // Assuming the correct path to your configuration file
import { getDatabase, ref, onValue } from "firebase/database";
import './Dashboard.css';
import { getToken, removeToken } from "../../utils/localStorage";
import { Box, Button, useToast } from "@chakra-ui/react";
import { Image } from "../image/Image";
import { Header } from "../header/Header";
import { normalizeEmail } from "../../utils/normalizeEmail";
import { setCurrentUser as _setCurrentUser } from "../../utils/currentUser";
import { setUsers as _setUsers } from "../../utils/users";
import { Sidebar } from "./Sidebar";

const database = getDatabase(config);
const usersRef = ref(database, "users");
const token = getToken();

function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const navigateToLogin = () => {
    navigate("/login");
  }

  const isLoggedIn = () => {
    return !!token;
  }

  const fetchUsers = () => {
    onValue(usersRef, (snapshot) => {
      const usersMap = snapshot.val();
      if (usersMap) {
        const normalizedEmail = normalizeEmail(token);
        if (usersMap[normalizedEmail]) {
          _setCurrentUser(usersMap[normalizedEmail]);
          setCurrentUser(usersMap[normalizedEmail]);
        }
        
        const usersInfo = Object.values(usersMap);
        _setUsers(usersInfo);
        setUsers(usersInfo);
      }
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      if (!isLoggedIn()) {
        navigateToLogin();
      }
    }, 1000);

    fetchUsers();
  }, []);

  const logout = () => {
    removeToken();
    toast({
      title: 'Successfully logged out',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/login');
  }

  if (isLoading) {
    return (
      <Box className="loading">
        <Image src="/loading.gif" alt="Loading..."/>
      </Box>
    );
  }

  return (
    <>
      <Header username={currentUser?.name || ''} onLogout={logout} />
      <Box display="flex" h="calc(100% - 57px)" w="250px">
        <Box className="sidebar" >
          <Sidebar users={users} />
        </Box>
      </Box>
    </>
  );
}

export default Dashboard;
