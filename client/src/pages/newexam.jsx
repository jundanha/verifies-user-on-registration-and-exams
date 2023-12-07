import React, { useEffect, useRef } from 'react';
import { ChakraProvider, Center, VStack, Button, Box } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import Webcam from 'react-webcam';

function NewExamPage() {
    const videoRef = useRef();

    useEffect(() => {
      const enableCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
        }
      };
  
      enableCamera();
  
      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
      };
    }, []);
  
    const handleRegisterExam = () => {
      console.log('Exam registered!');
    };
  
    return (
      <ChakraProvider>
        <Box position="absolute" top="10px" left="10px">
            <Button 
                variant='outline'
                as={RouterLink}
                to="/">Back</Button>
        </Box>
        <Center h="100vh">
          <VStack>
            <Webcam
              audio={false}
              ref={videoRef}
              style={{ width: '100%', height: 'auto' }}
            />
            <Button 
                onClick={handleRegisterExam} 
                colorScheme="blue" 
                size="lg"
                as={RouterLink}
                to='/gettoken'>
              Register Exam
            </Button>
          </VStack>
        </Center>
      </ChakraProvider>
    );
  }

export default NewExamPage;