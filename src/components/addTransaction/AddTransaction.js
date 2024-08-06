import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Checkbox, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, FormControl, FormLabel, Input, InputGroup, InputLeftElement, Select, Stack, Switch, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { getLastDayOfMonth } from "../../utils/getLastDayOfMonth";
import { getUsers } from "../../utils/users";
import { getToken } from "../../utils/localStorage";
import { dollar, isValidDollarAmount } from "../../utils/dollar";
import { EditCustomAmount } from "./EditCustomAmount";
import { LeftOverSection } from "./LeftOverSection";
import { EditYourPortion } from "./EditYourPortion";
import { addTransaction } from "./submit";
import { normalizeEmail } from "../../utils/normalizeEmail";

let splitMap = {};
export const AddTransaction = ({ refresh }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [name, setName] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);

  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [day, setDay] = useState(null);

  const [amount, setAmount] = useState(null);
  const [isAmountValid, setIsAmountValid] = useState(true);
  const [isEvenSplit, setIsEvenSplit] = useState(true);
  const [yourPortion, setYourPortion] = useState(0);
  const [isYourPortionValid, setIsYourPortionValid] = useState(true);

  const [users, setUsers] = useState([]);
  const [usersSelected, setUsersSelected] = useState(new Set());

  const [leftOverAmount, setLeftOverAmount] = useState(0);
  const [updateCount, setUpdateCount] = useState(0);

  const handleClose = () => {
    setName('');
    setAmount(null);
    setIsAmountValid(true);
    setYourPortion(0)
    setIsYourPortionValid(true);
    setIsEvenSplit(true);
    setUsersSelected(new Set());
    splitMap = {};
    refresh();

    onClose();
  };
  
  const fetchUsers = async () => {
    const token = getToken();
    const users = await getUsers();
    setUsers(users.filter((user) => user.email !== token));
  };

  useEffect(() => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth() + 1);
    setDay(now.getDate());

    fetchUsers();
  }, []);

  const onSwitchChange = () => {
    setIsEvenSplit(!isEvenSplit);
  }

  useEffect(() => {
    if (!(amount && isAmountValid)) {
      setLeftOverAmount(0);
      return;
    }

    let leftOverAmount = amount;
    leftOverAmount -= yourPortion || 0;
    Object.values(splitMap).forEach((split) => {
      leftOverAmount -= split;
    });

    setLeftOverAmount(Math.round(leftOverAmount * 100) / 100);
  }, [amount, isAmountValid, yourPortion, updateCount]);

  const updateSplitMap = useCallback((updates) => {
    if (!(amount && isAmountValid)) {
      splitMap = {};
      return;
    }

    let newMap = {};
    const splittingUsers = [...usersSelected];
    // Counting youself
    const numOfPeople = splittingUsers.length + 1;
  
    if (isEvenSplit) {
      const avg = Math.round(amount / numOfPeople * 100) / 100;
      splittingUsers.forEach((email) => {
        newMap[email] = avg;
      });
      setYourPortion(avg);
    } else {
      newMap = { ...splitMap, ...updates };
    }

    splitMap = newMap;
    setUpdateCount(updateCount + 1);
  }, [amount, isAmountValid, usersSelected, isEvenSplit]);

  useEffect(() => {
    if (amount) {
      updateSplitMap();
    }
  }, [isEvenSplit, updateSplitMap, amount]);

  const onNameChange = (event) => {
    setName(event.target.value);
  };
  const onNameBlur = () => {
    if (!name) {
      setIsNameValid(false);
    }
  };
  const onNameFocus = () => {
    setIsNameValid(true);
  };

  const onYearSelect = (event) => {
    setYear(event.target.value || null);
  };
  const onMonthSelect = (event) => {
    setMonth(event.target.value || null);
    setDay(null);
  };
  const onDaySelect = (event) => {
    setDay(event.target.value || null);
  };

  const onAmountBlur = (event) => {
    const value = event.target.value;
    const isValid = isValidDollarAmount(value);
    setIsAmountValid(isValid);
    if (isValid) {
      const newAmount = parseFloat(value);
      setAmount(newAmount);
      event.target.value = newAmount.toFixed(2);
    }
  };

  const onUpdateYourPortion = (amount) => {
    const isValid = isValidDollarAmount(amount);
    setIsYourPortionValid(isValid);
    if (isValid) {
      setYourPortion(amount);
    }
  };

  const onCheckboxChange = (email) => {
    if (usersSelected.has(email)) {
      usersSelected.delete(email);
      delete splitMap[email];
    } else {
      usersSelected.add(email);
    }

    setUsersSelected(new Set([...usersSelected]));
  }

  const onUpdateCustomAmount = (email, value) => {
    if (!splitMap[email]) return;

    splitMap[email] = value;
    setUpdateCount(updateCount + 1);
  };

  const onSubmit = () => {
    const splits = {};
    Object.keys(splitMap).forEach((key) => {
      const normalizedEmail = normalizeEmail(key);
      splits[normalizedEmail] = splitMap[key];
    });
    addTransaction({
      name,
      year,
      month,
      day,
      amount,
      splits,
    }).then((res) => {
      console.log(res);

      toast({
        title: 'Successfully submitted!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      handleClose();
    }).catch((err) => {
      toast({
        title: err.message,
        description: 'Please double check the form.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    });
  };

  const lastDayOfMonth = getLastDayOfMonth(year, month);
  const daysOfMonth = Array.from({length: lastDayOfMonth}, (_, i) => i + 1);

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue" ml="12px" size="md">
        <Box display="flex" alignItems="center" gap="8px">
          <AddIcon /> Add new
        </Box>
      </Button>

      <Drawer isOpen={isOpen} onClose={handleClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add new expense</DrawerHeader>

          <DrawerBody display="flex" flexDirection="column">
            <Text mb="4px" color="gray.300" fontSize="14px">Name of the event</Text>
            <InputGroup mb="20px">
              <Input
                placeholder="e.g. Freshroll"
                value={name}
                onChange={onNameChange}
                onBlur={onNameBlur}
                onFocus={onNameFocus}
                isInvalid={!isNameValid}
              />
            </InputGroup>

            <Text mb="4px" color="gray.300" fontSize="14px">Date of the event</Text>
            <Stack direction={['column', 'row']} mb="20px">
              <Select placeholder="Select year" value={year} onChange={onYearSelect} isInvalid={!year}>
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </Select>
              <Select placeholder="Select month" value={month} onChange={onMonthSelect} isInvalid={!month}>
                <option value={1}>Jan</option>
                <option value={2}>Feb</option>
                <option value={3}>Mar</option>
                <option value={4}>Apr</option>
                <option value={5}>May</option>
                <option value={6}>Jun</option>
                <option value={7}>Jul</option>
                <option value={8}>Aug</option>
                <option value={9}>Sep</option>
                <option value={10}>Oct</option>
                <option value={11}>Nov</option>
                <option value={12}>Dec</option>
              </Select>
              <Select placeholder="Select day" value={day} onChange={onDaySelect} isInvalid={!day}>
                {daysOfMonth.map((day) => (
                  <option value={day} key={day}>{day}</option>
                ))}
              </Select>
            </Stack>

            <Text mb="4px" color="gray.300" fontSize="14px">Amount to split</Text>
            <InputGroup mb="4px">
              <InputLeftElement pointerEvents="none" color="#81c995" fontSize="1.2em">$</InputLeftElement>
              <Input
                onBlur={onAmountBlur}
                isInvalid={!isAmountValid}
              />
            </InputGroup>
            <FormControl display="flex" alignItems="center" mb="20px">
              <FormLabel htmlFor="event-split" mb={0} fontWeight="normal" fontSize="14">
                Split evenly?
              </FormLabel>
              <Switch colorScheme="blue" id="event-split" isChecked={isEvenSplit} onChange={onSwitchChange} />
            </FormControl>
            
            <Box fontSize="14px" mb="20px" position="relative">
              <Text color="gray.300">Your portion (for guidance):</Text>
              <Text as="span" color="#81c995">{dollar(yourPortion || 0)}</Text>
              <Box position="absolute" right={0} bottom="4px">
                <EditYourPortion
                  baseAmount={yourPortion}
                  shouldRender={!isEvenSplit}
                  onSubmit={onUpdateYourPortion}
                />
              </Box>
            </Box>

            <Text mb="4px" color="gray.300" fontSize="14px">Who were you with?</Text>
            <Stack mb="20px">
              {[...users].map((user, idx) => {
                const isChecked = usersSelected.has(user.email);
                const currentSplit = splitMap[user.email];
                return (
                  <Box key={user.email}>
                    <Box display="flex" alignItems="center">
                      <Checkbox
                        size="lg"
                        checked={isChecked}
                        onChange={() => onCheckboxChange(user.email)}
                      >
                        <Text
                          maxW="180px"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          overflow="hidden"
                          mr="8px"
                          fontSize="16px"
                        >
                          {user.name}
                        </Text>
                      </Checkbox>
                      <EditCustomAmount
                        shouldRender={amount && isAmountValid && isChecked && !isEvenSplit}
                        onSubmit={(value) => onUpdateCustomAmount(user.email, value)}
                        baseAmount={currentSplit}
                        name={user.name}
                      />
                    </Box>
                    {isChecked && currentSplit && (
                      <Text mt="-4px" fontSize="14px" ml="28px" color="#81c995">
                        owes you {dollar(currentSplit)}
                      </Text>
                    )}
                  </Box>
                );
              })}
            </Stack>
            
            <Box mt="auto">
              <LeftOverSection amount={amount} leftover={leftOverAmount} splitMap={splitMap} />
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>Close</Button>
            <Button colorScheme='blue' onClick={onSubmit}>
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
};
