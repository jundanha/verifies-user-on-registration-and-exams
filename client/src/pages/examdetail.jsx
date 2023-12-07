import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFoundPage from "./notfound";
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Heading, Image, Link, Table, TableContainer, Tbody, Text, Th, Thead, Tr } from "@chakra-ui/react";

function ExamDetailPage() {
  const dummy = { 
    examID : "aGHaV1YLaNnyhLTfzfNT",
    isTaken : true,
    faceRegistered: "https://storage.googleapis.com/c23-capstone-project-bucket/photos/1d1473e0-5492-494b-8822-2b1e2f1a8cab.png",
    faceAtExam : "https://storage.googleapis.com/c23-capstone-project-bucket/photos/1d1473e0-5492-494b-8822-2b1e2f1a8cab.png",
    faceResult : 0.98762,
    isMatch : true,
    activity : [
      {
        time : "10:00:00",
        verdict : "menoleh ke kanan",
        proof : "https://storage.googleapis.com/c23-capstone-project-bucket/photos/1d1473e0-5492-494b-8822-2b1e2f1a8cab.png"
      },
      {
        time : "10:00:00",
        verdict : "menoleh ke kanan",
        proof : "https://storage.googleapis.com/c23-capstone-project-bucket/photos/1d1473e0-5492-494b-8822-2b1e2f1a8cab.png"
      },
      {
        time : "10:09:00",
        verdict : "tidak ada wajah terdeteksi",
        proof : "https://storage.googleapis.com/c23-capstone-project-bucket/photos/1d1473e0-5492-494b-8822-2b1e2f1a8cab.png"
      },
      // {
      //   time : "10:10:00",
      //   verdict : "lorem ipsum dolor sit amet",
      //   proof : "https://storage.googleapis.com/c23-capstone-project-bucket/photos/1d1473e0-5492-494b-8822-2b1e2f1a8cab.png"
      // },
      // {
      //   time : "10:00:00",
      //   verdict : "menoleh ke kanan",
      //   proof : "https://storage.googleapis.com/c23-capstone-project-bucket/photos/1d1473e0-5492-494b-8822-2b1e2f1a8cab.png"
      // },
      // {
      //   time : "10:00:00",
      //   verdict : "menoleh ke kanan",
      //   proof : "https://storage.googleapis.com/c23-capstone-project-bucket/photos/1d1473e0-5492-494b-8822-2b1e2f1a8cab.png"
      // },
      // {
      //   time : "10:09:00",
      //   verdict : "tidak ada wajah terdeteksi",
      //   proof : "https://storage.googleapis.com/c23-capstone-project-bucket/photos/1d1473e0-5492-494b-8822-2b1e2f1a8cab.png"
      // },
      // {
      //   time : "10:10:00",
      //   verdict : "lorem ipsum dolor sit amet",
      //   proof : "https://storage.googleapis.com/c23-capstone-project-bucket/photos/1d1473e0-5492-494b-8822-2b1e2f1a8cab.png"
      // },
      // {
      //   time : "10:00:00",
      //   verdict : "menoleh ke kanan",
      //   proof : "https://storage.googleapis.com/c23-capstone-project-bucket/photos/1d1473e0-5492-494b-8822-2b1e2f1a8cab.png"
      // },
      // {
      //   time : "10:00:00",
      //   verdict : "menoleh ke kanan",
      //   proof : "https://storage.googleapis.com/c23-capstone-project-bucket/photos/1d1473e0-5492-494b-8822-2b1e2f1a8cab.png"
      // },
      // {
      //   time : "10:09:00",
      //   verdict : "tidak ada wajah terdeteksi",
      //   proof : "https://storage.googleapis.com/c23-capstone-project-bucket/photos/1d1473e0-5492-494b-8822-2b1e2f1a8cab.png"
      // },
      // {
      //   time : "10:10:00",
      //   verdict : "lorem ipsum dolor sit amet",
      //   proof : "https://storage.googleapis.com/c23-capstone-project-bucket/photos/1d1473e0-5492-494b-8822-2b1e2f1a8cab.png"
      // }
    ]

  }

  const { examID } = useParams();
  const [ exam, setExam ] = useState();

  useEffect(() => {
    setExam(dummy)
  }, [])

  if (!exam) {
    return (
      <NotFoundPage />
    )
  }


  return (
    <Box
      bgGradient="linear(to-tr, #B6FFFA, #687EFF)"
      w="100%" minH="100vh"
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
          to="/examhistory"
        >
          Back
        </Button>
        <Heading
          my={4}
          fontSize="4xl"
          color="white"
          fontFamily={"sans-serif"}
        >
          Exams-{examID}
        </Heading>
      </Box>
      <Box
        display='flex'
        flexDir='row'
        alignItems={"center"}
        w='100%'
        px='5' my='5'
      >
        <Box
          display='flex'
          flexDir='column'
          alignItems={"center"}
          w='100%'
          px='5'
        >
          <Text
            mb={4}
            fontSize="xl"
            fontWeight="bold"
            color="white"
            fontFamily={"sans-serif"}
          >
            Face Registered
          </Text>
          <Image
            src={exam.faceRegistered}
            alt="face at exam"
            maxH={"100px"}
          /> 
        </Box>
        <Box
          display='flex'
          flexDir='column'
          alignItems={"center"}
          w='100%'
          px='5'
        >
         <Text
            mb={4}
            fontSize="xl"
            fontWeight="bold"
            color="white"
            fontFamily={"sans-serif"}
          >
            Face at Exam
          </Text>
          <Image
            src={exam.faceAtExam}
            alt="face at exam"
            maxH={"100px"}
          />   
        </Box>
      </Box>
      <Box
        display='flex'
        flexDir='column'
        alignItems={"center"}
        justifyContent={"center"}
        w='100%'
        px='5' my='3'
        backgroundColor={"white"}
        borderRadius='md'
      >
        <Text
          fontSize="md"
          fontWeight="bold"
          color="black"
          fontFamily={"sans-serif"}
        >
          Face Result : {exam.faceResult} ({exam.isMatch ? "Match" : "Not Match"})
        </Text>
      </Box>
      <Box
        display='flex'
        flexDir='column'
        alignItems={"center"}
        justifyContent={"center"}
        w='100%'
        borderRadius='md'
      >
        <Text
          fontSize="3xl"
          fontWeight="bold"
          color="white"
          fontFamily={"sans-serif"}
        >
          Activity during Exam
        </Text>
        <TableContainer
          w='100%'
          px='5' my='3'
          backgroundColor={"white"}
          borderRadius='md'
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Time</Th>
                <Th>Verdict</Th>
                <Th>Proof</Th>
              </Tr>
            </Thead>
            <Tbody>
              {exam.activity.map((activity, index) => (
                <Tr key={index}>
                  <Th>{activity.time}</Th>
                  <Th>{activity.verdict}</Th>
                  <Th>
                    <Link
                      href={activity.proof}
                      isExternal
                      color="blue.500"
                      textDecoration={"underline"}
                    >
                      View
                    </Link>
                  </Th>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <Box
        display='flex'
        flexDir='column'
        alignItems={"end"}
        justifyContent={"center"}
        w='100%'
        px='5' my='3'
      >
        <Button
          colorScheme="blue"
          size="lg"
          w="200px"
        >
          Download This Report
        </Button> 
      </Box>
    </Box>
  )
}

export default ExamDetailPage