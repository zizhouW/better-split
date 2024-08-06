import { EditIcon } from "@chakra-ui/icons";
import { Button, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Tooltip, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { dollar, isValidDollarAmount } from "../../utils/dollar";

export const EditCustomAmount = ({ shouldRender, baseAmount, onSubmit, name }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amount, setAmount] = useState(0);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setAmount(baseAmount);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    setTimeout(() => {
      if (!isValid) return;
      console.log(amount)
      onSubmit(amount);
      onClose();
    }, 100);
  };

  const onBlur = (event) => {
    const value = event.target.value;
    const valid = isValidDollarAmount(value);
    setIsValid(valid);
    if (valid) {
      const newAmount = Math.round(parseFloat(value) * 100) / 100;
      setAmount(newAmount);
      event.target.value = newAmount.toFixed(2);
    }
  };

  if (!shouldRender) return null;

  return (
    <>
      <Tooltip label="Edit custom amount">
        <Button size="xs" onClick={onOpen}>
          <EditIcon />
        </Button>
      </Tooltip>
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit amount for {name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="4px" color="gray.300" fontSize="14px"><b>{name}</b>'s current amount is&nbsp;
              <Text as="span" color="#81c995">{dollar(baseAmount || 0)}</Text>
            </Text>
            <InputGroup mb="4px">
              <InputLeftElement pointerEvents="none" color="#81c995" fontSize="1.2em">$</InputLeftElement>
              <Input
                placeholder="Enter new amount"
                onBlur={onBlur}
                isInvalid={!isValid}
              />
            </InputGroup>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
