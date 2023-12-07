import React, { useRef, useState } from 'react';
import { ChakraProvider, VStack, Box, Button } from '@chakra-ui/react';
import Webcam from 'react-webcam';

function FaceRegister() {
  const webcamRef = useRef(null);
  const [textOutput, setTextOutput] = useState('');

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // Perform face recognition logic here with the captured image

    // For this example, we'll set a placeholder text
    setTextOutput('Face recognized!'); // Replace this with your logic
  };

  return (
    <ChakraProvider>
      <VStack spacing={4} align="center">
        <Box w="80%" h="auto">
          <Webcam
            audio={false}
            ref={webcamRef}
            style={{ width: '100%', height: 'auto' }}
            screenshotFormat="image/jpeg"
          />
        </Box>
        <Box>{textOutput}</Box>
        <Button colorScheme="blue" size="lg" onClick={capture}>
          Next
        </Button>
      </VStack>
    </ChakraProvider>
  );
}

export default FaceRegister;
