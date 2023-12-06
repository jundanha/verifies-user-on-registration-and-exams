import React, { useEffect, useRef } from 'react';
import { ChakraProvider, Center, VStack, Button } from '@chakra-ui/react';
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
        // Clean up and stop the camera when component unmounts
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
      };
    }, []);
  
    const handleRegisterExam = () => {
      // Handle registration logic here
      console.log('Exam registered!');
    };
  
    return (
      <ChakraProvider>
        <Center h="100vh">
          <VStack>
            <Webcam
              audio={false}
              ref={videoRef}
              style={{ width: '100%', height: 'auto' }}
            />
            <Button onClick={handleRegisterExam} colorScheme="blue" size="lg">
              Register Exam
            </Button>
          </VStack>
        </Center>
      </ChakraProvider>
    );
  }

export default NewExamPage;