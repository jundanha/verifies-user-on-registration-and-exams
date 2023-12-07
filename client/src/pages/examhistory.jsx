import { Box, Button, Card, Heading, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Link as RouterLink } from 'react-router-dom';

function ExamHistoryPage() {
  const [examHistory, setExamHistory] = useState([])

  useEffect(() => {
    const fetchExamHistory = async () => {
      try {
        const response = await fetch('http://localhost:5000/list_exams');
        if (!response.ok) {
          throw new Error(`Failed to fetch exam history. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data.exams);
        setExamHistory(data.exams);
      } catch (error) {
        console.error('Error fetching exam history:', error);
      }
    };

    fetchExamHistory();
  }, []);

  return (
    <Box
      bgGradient="linear(to-tr, #B6FFFA, #687EFF)"
      w="100%" h="100vh"
      p={3}
      color="white"
      display="flex"
      alignItems="center"
      flexDir="column"
    >
      <Box
        display='flex'
        flexDir='row'
        alignItems={"center"}
        justifyContent='space-between'
        w='100%'
        px='5'
      >
        <Button
          variant='outline'
          as={RouterLink}
          to="/"
        >
          Back
        </Button>
        <Heading
          my={4}
          fontSize="4xl"
          color="white"
          fontFamily={"sans-serif"}
        >
          Exams History
        </Heading>
      </Box>
      <Box
        display='flex'
        flexDir='column'
        alignItems={"center"}
        w='100%'
        px='5' my='5'
        backgroundColor={"white"}
        borderRadius='xl'
        h='80vh'
        overflow={"auto"}
      >
        { examHistory.map((exam, index) => (
          <Card
            key={index}
            w='100%'
            my={2}
            p={3}
            display='flex'
            flexDir='row'
            alignItems={"center"}
            justifyContent='space-between'
            borderRadius='md'
            boxShadow='md'
            backgroundColor={exam.isTaken ? 'green.100' : 'gray.100'}
          >
            <Box
              display='flex'
              flexDir='column'
              alignItems={"flex-start"}
            >
              <Heading
                fontSize="xl"
                color="black"
                fontFamily={"sans-serif"}
              >
                Exam {index+1}
              </Heading>
              <Text
                fontSize="sm"
                color="black"
                fontFamily={"sans-serif"}
                my='1'
              >
                examID : {exam.examID}
              </Text>
              <Text
                fontSize="sm"
                color="black"
                fontFamily={"sans-serif"}
                my='1'
              >
                status : {exam.isTaken ? 'Taken' : 'Not Taken'}
              </Text>
            </Box>
            <Button
              variant='outline'
              as={RouterLink}
              to={`/examhistory/${exam.examID}`}
            >
              Details
            </Button>
          </Card>
        ))}
        </Box>
    </Box>
  )
}

export default ExamHistoryPage