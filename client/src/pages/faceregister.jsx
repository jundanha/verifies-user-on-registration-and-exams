import React, { useRef, useState } from 'react';
import { ChakraProvider, Center, VStack, Box, Button, Flex } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
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
      <Flex direction="column" align="center">
        <Box position="absolute" top="10px" left="10px">
          <Button 
            variant='outline'
            as={RouterLink}
            to="/">Back</Button>
        </Box>
        <Center h="15vh"></Center>
          <VStack></VStack>
            <Webcam
              audio={false}
              ref={webcamRef}
              style={{ width: '100%', height: 'auto' }}
              screenshotFormat="image/jpeg"
            />
        <Box mt={4} fontSize="lg">match value:</Box>
        <Button 
          colorScheme="blue" 
          size="lg" 
          mt={4} 
          onClick={capture}
          as={RouterLink}
          to='/streamvideo'>
          Next
        </Button>
      </Flex>
    </ChakraProvider>
  );
}

export default FaceRegister;
