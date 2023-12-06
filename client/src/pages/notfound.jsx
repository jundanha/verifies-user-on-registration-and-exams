import { Box, Heading, Link, Text } from "@chakra-ui/react"
import { Link as RouterLink } from 'react-router-dom';

function NotFoundPage () {
  return (
    <Box
      bgGradient="linear(to-tr, #B6FFFA, #687EFF)"
      w="100%" h="100vh"
      p={4}
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
    >
      <Box
        display='flex'
        flexDir='column'
      >
        <Heading
          mb={4}
          fontSize="6xl"
          fontWeight="bold"
          color="white"
          fontFamily={"sans-serif"}
          fontStyle={"bold"}
        >
          404 - Not Found
        </Heading>
        <Text
        >
          Sorry, the page you are looking for does not exist.
        </Text>
        <Link
          as={RouterLink}
          to="/"
          mt='5'
          _hover={{ color: 'blue.800' }}
          textDecoration={"underline"}
        >
          Back to Homepage
        </Link>
      </Box>
    </Box>
  )
}

export default NotFoundPage