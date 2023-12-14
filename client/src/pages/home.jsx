import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { Link as RouterLink} from 'react-router-dom';

function HomePage() {
  return (
    <>
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
          w="100%"
          maxWidth="700px"
          textAlign="center"
        >
          <Text
            mb={4}
            fontSize="xl"
            fontWeight="bold"
            color="white"
            fontFamily={"sans-serif"}
          > 
            Bangkit Company Capstone Project
          </Text>
          <Heading 
            mb={4}
            fontSize="6xl"
            fontWeight="bold"
            color="white"
            fontFamily={"sans-serif"}
            fontStyle={"italic"}
          >
            Verifies User on Registration and Exams
          </Heading>
          <Text
            mb={4}
            fontSize="l"
            fontWeight="bold"
            color="white"
            fontFamily={"sans-serif"}
            fontStyle={"italic"}
          >
            <div> Welcome to our prototype website showcasing the user registration and verification during exams, featuring face and gesture recognition.</div>
            <div>‼️This website is a prototype created solely for demonstration purposes. All functionalities presented here are simulated and aimed at showcasing the potential of these technologies.‼️</div>
            </Text>
          <Text
            mb={4}
            fontSize="l"
            fontWeight="bold"
            color="white"
            fontFamily={"sans-serif"}
          >by: Jundan, Agung, Faiza, Kezia</Text>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          m='4'
          flexDir='column'
        >
          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            m='2'
            flexDir='row'
          >
            <Button
              colorScheme="blue"
              size="lg"
              w="250px"
              mx='4'
              as={RouterLink}
              to='/newexam'
            >
              New Exam
            </Button>
            <Button
              colorScheme="blue"
              size="lg"
              w="250px"
              mx='4'
              as={RouterLink}
              to='/startexam'
            >
              Start Exam
            </Button>
          </Box>
          <Button
            colorScheme="blue"
            size="lg"
            w="400px"
            m='4'
            as={RouterLink}
            to='/examhistory'
          >
            View Exam History
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default HomePage