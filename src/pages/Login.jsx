import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  VStack,
  useToast,
  Link,
  Container,
} from "@chakra-ui/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      dispatch(setUser(userCredential.user));
      toast({
        title: "Login Successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <Box bg="white" p={8} rounded="lg" boxShadow="lg">
        <VStack spacing={6}>
          <Heading size="lg" textAlign="center">Login</Heading>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              focusBorderColor="teal.500"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              focusBorderColor="teal.500"
            />
          </FormControl>
          <Button
            colorScheme="teal"
            w="full"
            onClick={handleLogin}
            isDisabled={!email || !password}
          >
            Login
          </Button>
          <Text>
            Don't have an account?{" "}
            <Link color="teal.500" onClick={() => navigate("/register")}>
              Register
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;