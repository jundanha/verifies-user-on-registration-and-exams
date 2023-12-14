import { useState, useEffect } from 'react';
import { Box, Button, FormControl, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { Link as RouterLink } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function UploadVideoPage() {
  const [examID, setExamID] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState('');

  useEffect(() => {
    const savedExamID = localStorage.getItem('examID');
    if (savedExamID) {
      setExamID(savedExamID);
    } else {
      window.location.href = '/';
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    if (!event.target.video.files[0]) {
      setErrorMessage('Video file not found');
      setIsLoading(false);
      setIsError(true);
      return;
    }

    const formData = new FormData();
    formData.append('examID', examID);
    formData.append('video', event.target.video.files[0]);

    try {
      const response = await fetch(`${API_URL}/add_video`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
        setIsError(true);
        setErrorMessage(errorData.error);
      } else {
        const responseData = await response.json();
        console.log('Success:', responseData.message);
        onOpen();
      }
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    const temporaryExamID = localStorage.getItem('examID');
    localStorage.removeItem('examID');
    onClose();
    window.location.href = `/examhistory/${temporaryExamID}`;
  };

  return (
    <>
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
            Upload Video
          </Heading>
        </Box>
        <Box
          w='100%' h='100%'
          display='flex'
          flexDir='column'
          alignItems='center'
          justifyContent='center'
        >
          Upload your exam video here
          <form onSubmit={handleSubmit}>
            <FormControl>
              <Input
                type="file"
                name="video"
                mb={2}
              />
              {
                isError &&
                <Box
                  bg="red.500"
                  color="white"
                  p={3}
                  borderRadius={5}
                  mb={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  {errorMessage}
                  <Button
                    variant='outline'
                    onClick={() => setIsError(false)}
                    ml={2}
                  >
                    x
                  </Button>
                </Box>
              }
              <Button
                type="submit"
                colorScheme="blue"
                variant={"outline"}
                isLoading={isLoading}
              >
                Submit
              </Button>
            </FormControl>
          </form>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={handleClose}
        isCentered
        motionPreset="slideInBottom"
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Success</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Video uploaded successfully! <br />
            The report will be available in the exam page.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleClose}>
              Go to Exam Report
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UploadVideoPage;
