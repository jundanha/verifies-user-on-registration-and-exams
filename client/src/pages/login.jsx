import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Link
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

function LoginPage() {
  return (
    <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="100vh"
        w='100vw'
      >
        <Box w="md" p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
          <Heading mb={4}>Login</Heading>
          <form>
            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input type="email" placeholder="Enter your email" />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Password</FormLabel>
              <Input type="password" placeholder="Enter your password" />
            </FormControl>
            <Button colorScheme="teal" mt={4} type="submit">
              Login
            </Button>
          </form>
          <Box mt={4}>
            <Link
              as={RouterLink}
              to="/register"
              color="teal.500"
              fontWeight="bold"
              _hover={{ color: 'teal.800' }}
            >
              Register
            </Link>
          </Box>
        </Box>
    </Box>
  );
}

export default LoginPage;