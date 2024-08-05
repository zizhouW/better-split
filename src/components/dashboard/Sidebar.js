import { Avatar, Box, Stack, Text } from "@chakra-ui/react";
import { getToken } from "../../utils/localStorage";
import { normalizeEmail } from "../../utils/normalizeEmail";

const token = getToken();
export const Sidebar = ({ users }) => {
  const renderOweing = (oweing) => {
    if (!oweing) return null;

    if (oweing > 0) {
      return <Text as="span" color="#39FF14" fontWeight="normal">owes you {oweing}</Text>;
    }

    return <Text as="span" color="#FFAC1C" fontWeight="normal">you owe {oweing}</Text>
  };

  return (
    <Box p="12px">
      <Text fontSize="2xl" mb="16px">Friends</Text>
      <Stack spacing={4} align="stretch">
        {users?.map?.((user) => {
          if (!user) return null;

          const isCurrentUser = user.email === token;
          const oweing = user.oweing[normalizeEmail(token)];

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
