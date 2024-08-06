import React, { useCallback, useEffect, useState } from "react";
import { useNavigate  } from "react-router-dom";
import './Dashboard.css';
import { getToken, removeToken } from "../../utils/localStorage";
import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerOverlay, useDisclosure, useToast } from "@chakra-ui/react";
import { Image } from "../image/Image";
import { Header } from "../header/Header";
import { getCurrentUser, getUsers } from "../../utils/users";
import { Sidebar } from "./Sidebar";
import { Transactions } from "../transactions/Transactions";
import { HamburgerIcon } from "@chakra-ui/icons";

function Dashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const token = getToken();

  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

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
  }, [navigateToLogin, fetchUsers, refreshCount]);

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
    setRefreshCount(refreshCount + 1);
  };

  if (isLoading) {
    return (
      <Box className="loading">
        <Image src="/loading.gif" alt="Loading..."/>
      </Box>
    );
  }

  const renderSidebar = () => (
    <Sidebar users={users.filter((user) => user.email !== token)} />
  );

  const renderMobileSidebar = () => {
    return (
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody className="mobile-sidebar">
            {renderSidebar()}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  };

  return (
    <>
      <Header username={currentUser?.name || ''} onLogout={logout} refresh={refresh}>
        <Box className="mobile-sidebar-container">
          <Button onClick={onOpen}>
            <HamburgerIcon />
          </Button>
          {renderMobileSidebar()}
        </Box>
      </Header>
      <Box display="flex" h="calc(100% - 57px)">
        <Box className="sidebar">
          {renderSidebar()}
        </Box>
        <Box flexGrow={1}>
          <Transactions refreshTransactions={refreshCount}/>
        </Box>
      </Box>
    </>
  );
}

export default Dashboard;
