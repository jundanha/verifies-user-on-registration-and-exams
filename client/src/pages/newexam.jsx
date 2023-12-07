import React, { useEffect, useRef } from 'react';
import { useClipboard, ChakraProvider, Center, VStack, Button, Box, useDisclosure } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import Webcam from 'react-webcam';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

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
  
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { onCopy, value, setValue, hasCopied } = useClipboard("");
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Token</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        token-12345
      </ModalBody>

      <ModalFooter>
      <Button onClick={onCopy}>{hasCopied ? "Copied!" : "Copy"}</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  
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
                onClick={onOpen} 
                colorScheme="blue" 
                size="lg">
              Register Exam
            </Button>
          </VStack>
        </Center>
      </ChakraProvider>
    );
  }

export default NewExamPage;