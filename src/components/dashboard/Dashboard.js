import React, { useCallback, useEffect, useState } from "react";
import { useNavigate  } from "react-router-dom";
import './Dashboard.css';
import { getToken, removeToken } from "../../utils/localStorage";
import { Box, useToast } from "@chakra-ui/react";
import { Image } from "../image/Image";
import { Header } from "../header/Header";
import { getCurrentUser, getUsers } from "../../utils/users";
import { Sidebar } from "./Sidebar";
import { Transactions } from "../transactions/Transactions";

function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();

  const token = getToken();

  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [refreshTransactions, setRefreshTransactions] = useState(0);

  const navigateToLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const isLoggedIn = () => {
    return !!token;
  }

  const fetchUsers = async () => {
    const users = await getUsers();
    setUsers(users);
    setCurrentUser(await getCurrentUser());
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      if (!isLoggedIn()) {
        navigateToLogin();
      }
    }, 1000);

    fetchUsers();
    // setInterval(() => {
    //   fetchUsers();
    // }, 5000);
  }, [navigateToLogin]);

  const logout = () => {
    removeToken();
    toast({
      title: 'Successfully logged out',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/login');
  };

  const refresh = () => {
    setRefreshTransactions(refreshTransactions + 1);
  };

  if (isLoading) {
    return (
      <Box className="loading">
        <Image src="/loading.gif" alt="Loading..."/>
      </Box>
    );
  }

  return (
    <>
      <Header username={currentUser?.name || ''} onLogout={logout} refresh={refresh} />
      <Box display="flex" h="calc(100% - 57px)">
        <Box className="sidebar">
          <Sidebar users={users.filter((user) => user.email !== token)} />
        </Box>
        <Box flexGrow={1}>
          <Transactions refreshTransactions={refreshTransactions}/>
        </Box>
      </Box>
    </>
  );
}

export default Dashboard;
