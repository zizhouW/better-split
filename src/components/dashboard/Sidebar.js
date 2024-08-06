import { Avatar, Box, Stack, Text } from "@chakra-ui/react";
import { getToken } from "../../utils/localStorage";
import { normalizeEmail } from "../../utils/normalizeEmail";
import { dollar } from "../../utils/dollar";

export const Sidebar = ({ users }) => {
  const token = getToken();

  const renderOweing = (oweing) => {
    if (!oweing) return null;

    if (oweing > 0) {
      return <Text as="span" color="#81c995" fontWeight="normal">owes you <b>{dollar(oweing)}</b></Text>;
    }

    return <Text as="span" color="#f28b82" fontWeight="normal">you owe <b>{dollar(oweing)}</b></Text>
  };

  return (
    <Box p="12px">
      <Text fontSize="2xl" mb="16px">Friends</Text>
      <Stack spacing={4} align="stretch">
        {users?.map?.((user) => {
          if (!user) return null;

          const isCurrentUser = user.email === token;
          const oweing = user.oweing?.[normalizeEmail(token)];

          return (
            <Box display="flex" key={user.email} alignItems="center">
              <Avatar name={user.name} mr="8px" />
              <Box lineHeight="1.25em">
                <Text as="span">{user.name}{isCurrentUser ? ' - You' : ''}</Text><br/>
                {renderOweing(oweing)}
              </Box>
            </Box>
          )
        })}
      </Stack>
    </Box>
  );
};
