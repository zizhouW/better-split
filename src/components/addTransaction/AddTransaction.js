import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Stack, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getLastDayOfMonth } from "../../utils/getLastDayOfMonth";

export const AddTransaction = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [day, setDay] = useState(null);

  useEffect(() => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth() + 1);
    setDay(now.getDate());
  }, []);

  const onMonthSelect = (event) => {
    setMonth(event.target.value);
    // setDay(1);
  };
  const onDaySelect = (event) => {
    setDay(event.target.value);
  };

  const onYearSelect = (event) => {
    setYear(event.target.value);
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add new expense</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack direction={['column', 'row']}>
              <Select placeholder="Select year" value={year} onChange={onYearSelect}>
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </Select>
              <Select placeholder="Select month" value={month} onChange={onMonthSelect}>
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
              <Select placeholder="Select day" value={day} onChange={onDaySelect}>
                {daysOfMonth.map((day) => (
                  <option value={day}>{day}</option>
                ))}
              </Select>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>Close</Button>
            <Button colorScheme='blue' onClick={onClose}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
};
