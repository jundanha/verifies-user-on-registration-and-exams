import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import NotFoundPage from "./notfound";
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Heading, Image, Table, TableContainer, Tbody, Text, Th, Thead, Tr } from "@chakra-ui/react";
import html2pdf from 'html2pdf.js';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function ExamDetailPage() {
  const { examID } = useParams();
  const [ exam, setExam ] = useState();
  const contentRef = useRef(null);

  useEffect(() => {

    const fetchExam = async () => {
      try {
        const response = await fetch(`${API_URL}/get_exam?examID=${examID}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch exam. Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log(data);
        setExam(data.exam);
      
      } catch (error) {
        console.error('Error fetching exam:', error);
      }
    }

    fetchExam();
  }, [])

  if (!exam) {
    return (
      <NotFoundPage />
    )
  }

  const downloadPDF = () => {
    const content = contentRef.current;

    if (!content) {
      console.error('Content not found for PDF generation');
      return;
    }

    const pdfOptions = {
      margin: 0,
      filename: `exam_report_${examID}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, 
        allowTaint: true, },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().from(content).set(pdfOptions).save();
  }

  return (
    <Box
      ref={contentRef} 
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
            // crossOrigin="*"
            alt="face at exam"
            maxH={"100px"}
            onError={(e) => {
              e.target.src = "https://img.icons8.com/ios/50/user-male-circle--v1.png";
            }}
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
            // crossOrigin="*"
            alt="face at exam"
            maxH={"100px"}
            onError={(e) => {
              e.target.src = "https://img.icons8.com/ios/50/user-male-circle--v1.png";
            }}
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
              {exam.activity && exam.activity.map((activity, index) => (
                <Tr key={index}>
                  <Th>{activity.timestamp}</Th>
                  <Th>{activity.verdict}</Th>
                  <Th>
                    <Image
                      src={activity.proof}
                      // crossOrigin="*"
                      alt="face at exam"
                      maxH={"100px"}
                      onError={(e) => {
                        e.target.src = "https://img.icons8.com/ios/50/user-male-circle--v1.png";
                      }}

                    />
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
          onClick={downloadPDF}
        >
          Download This Report
        </Button> 
      </Box>
    </Box>
  )
}

export default ExamDetailPage