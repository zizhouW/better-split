import { Avatar, Box, Button, Menu, MenuButton, MenuGroup, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { Image } from "../image/Image";
import './Header.css';
import { ChevronDownIcon } from "@chakra-ui/icons";
import { AddTransaction } from "../addTransaction/AddTransaction";

export const Header = ({ username, onLogout }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap="8px"
      borderBottom="1px solid"
      borderBottomColor="gray"
      px="12px"
      py="8px"
    >
      <Image src="/header-icon.png" alt="header icon" width="40px" height="40px" />
      <Text fontSize="24px" fontWeight="bold">Better Split</Text>
      <AddTransaction />
      <Box ml="auto">
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar name={username} size="sm" />
          </MenuButton>
          <MenuList>
            <MenuGroup title={username}>
              <MenuItem onClick={onLogout}>Logout</MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
};
