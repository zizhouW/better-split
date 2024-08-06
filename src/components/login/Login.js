import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate  } from "react-router-dom";
import { Box, Button, Input, Link, Text, Stack, InputGroup, InputLeftElement, useToast} from "@chakra-ui/react"
import { EmailIcon, InfoIcon, LockIcon, StarIcon } from "@chakra-ui/icons";
import './Login.css';
import { signUp, login } from "./submit";
import { getToken, setToken } from "../../utils/localStorage";
import { isInviteCodeCorrect } from "../../utils/inviteCode";
import { Image } from "../image/Image";

const LOGIN = 'Login';
const SIGNUP = 'Sign up';

const usernameRegex = /^[\w\-\s]+$/;
const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isDoubleTake, setIsDoubleTake] = useState(0);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const [isUsernameInvalid, setIsUsernameInvalid] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const submitButtonRef = useRef(null);

  const redirectToHomePage = useCallback(() => {
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const token = getToken();
    if (token) {
      redirectToHomePage();
    }
  }, [redirectToHomePage]);

  const toggleSignUp = () => {
    if (isSignUp) {
      setIsDoubleTake(isDoubleTake + 1);
    }
    setIsSignUp(!isSignUp);

    setUsername('');
    setEmail('');
    setPassword('');
    setInviteCode('');
    setIsUsernameInvalid(false);
    setIsEmailInvalid(false);
    setIsPasswordInvalid(false);
  };
  
  const onUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const onUsernameBlur = (event) => {
    if (!event.target.value.length) return;
    if (!usernameRegex.test(event.target.value) || event.target.value.length < 3) {
      setIsUsernameInvalid(true);
    }
  };
  
  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const onEmailBlur = (event) => {
    if (!event.target.value.length) return;
    if (!emailRegex.test(event.target.value)) {
      setIsEmailInvalid(true);
    }
  };
  
  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const onPasswordBlur = (event) => {
    if (!event.target.value.length) return;
    if (event.target.value.length < 6) {
      setIsPasswordInvalid(true);
    }
  };

  const showInvalidFormToast = () => {
    toast({
      title: 'Invalid input.',
      description: 'Please double check the errors shown.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const onSubmit = () => {
    if (isUsernameInvalid || isEmailInvalid || isPasswordInvalid) {
      showInvalidFormToast();
      return;
    }

    if (isSignUp && isInviteCodeCorrect(inviteCode)) {
      signUp({ username, email, password }).then(() => {
        setToken(email);

        toast({
          title: 'Successfully signed up!',
          description: 'You will be redirected soon...',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        redirectToHomePage();
      }).catch((err) => {
        toast({
          title: 'Error signing up',
          description: err.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
    } else if (isSignUp) {
      toast({
        title: 'What\'s the invite code?',
        description: 'Bro?',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Login
      login({ email, password }).then((res) => {
        setToken(res.email);
        
        toast({
          title: 'Successfully logged in!',
          description: 'You will be redirected soon...',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        redirectToHomePage();
      }).catch((err) => {
        toast({
          title: 'Error logging in',
          description: err.msg,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
    }
  };

  const shouldDisableSubmit = () => {
    if (isSignUp) {
      if (!username.length || !email.length || !password.length) return true;
      if (isUsernameInvalid || isEmailInvalid || isPasswordInvalid) return true;
    }
    
    if (!email.length || !password.length) return true;
    if (isEmailInvalid || isPasswordInvalid) return true;

    return false;
  }

  const renderForm = () => {
    const isSubmitDisabled = shouldDisableSubmit();
    return (
      <Box m="auto" mt="40px" maxW="800px">
        <Stack spacing={4}>
          {/* Invite code */}
          {isSignUp ? (
            <InputGroup>
              <InputLeftElement pointerEvents='none' color='gold' fontSize='1.2em'>
                <StarIcon color="gold" />
              </InputLeftElement>
              <Input
                placeholder='Enter invite code'
                value={inviteCode}
                onChange={(event) => setInviteCode(event.target.value)}
              />
            </InputGroup>
          ) : null}

          {/* Username */}
          {isSignUp ? (
            <InputGroup>
              <InputLeftElement pointerEvents='none'>
                <InfoIcon color='gray.300' />
              </InputLeftElement>
              <Input
                placeholder='Username'
                value={username}
                onChange={onUsernameChange}
                onBlur={onUsernameBlur}
                onFocus={() => setIsUsernameInvalid(false)}
                isInvalid={isUsernameInvalid}
                errorBorderColor="crimson"
              />
            </InputGroup>
          ): null}

          {/* Email */}
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <EmailIcon color='gray.300' />
            </InputLeftElement>
            <Input
              placeholder={`Email${isSignUp ? ' (no spam)' : ''}`}
              value={email}
              onChange={onEmailChange}
              onBlur={onEmailBlur}
              onFocus={() => setIsEmailInvalid(false)}
              isInvalid={isEmailInvalid}
              errorBorderColor="crimson"
            />
          </InputGroup>

          {/* Password */}
          <InputGroup>
            <InputLeftElement pointerEvents='none' color='gray.300' fontSize='1.2em'>
              <LockIcon color='gray.300' />
            </InputLeftElement>
            <Input
              type="password"
              placeholder='Password'
              value={password}
              onChange={onPasswordChange}
              onBlur={onPasswordBlur}
              onFocus={() => setIsPasswordInvalid(false)}
              isInvalid={isPasswordInvalid}
              errorBorderColor="crimson"
            />
          </InputGroup>

          <Box color="crimson" mb={4}>
            <Box>{isUsernameInvalid ? '- Username must be alphanumeric and at least 3 characters long' : null}</Box>
            <Box>{isEmailInvalid ? '- Wrong email format' : null}</Box>
            <Box>{isPasswordInvalid ? '- Password isn\'t strong enough' : null}</Box>
          </Box>

          <Box w="100%" display="flex" alignItems="center" justifyContent="space-between">
            <Link color='blue.500' onClick={toggleSignUp}>{isSignUp ? LOGIN : SIGNUP}</Link>
            <Button colorScheme='blue' size='lg' onClick={onSubmit} isDisabled={isSubmitDisabled} ref={submitButtonRef}>
              {isSignUp ? SIGNUP : LOGIN}
            </Button>
          </Box>
        </Stack>
      </Box>
    )
  };

  return (
    <div className="container">
      <Box mt="52px" display="flex" flexDirection="column" alignItems="center" gap={4}>
        <Image src="/icon.png" alt="icon" />
        <Text fontSize={50} fontWeight="bold" textAlign="center">
          {isDoubleTake > 1 ? 'Damn... make up your mind?' : 'Welcome to BetterSplit!'}
        </Text>
      </Box>
      {renderForm()}
    </div>
  )
}
