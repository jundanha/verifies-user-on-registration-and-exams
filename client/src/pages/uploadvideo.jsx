import { useState, useEffect } from 'react';
import { Box, Button, FormControl, Heading, Input } from "@chakra-ui/react";
import { Link as RouterLink } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function UploadVideoPage() {
  const [examID, setExamID] = useState('');

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

    const formData = new FormData();
    formData.append('examID', examID);
    formData.append('video', event.target.video.files[0]);

    try {
      const response = await fetch('/add_video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
        //  TODO : Handle error display
      } else {
        const responseData = await response.json();
        console.log('Success:', responseData.message);
        //  TODO : Handle success display
      }
    } catch (error) {
      console.error('Error:', error);
      // TODO : Handle network error or unexpected issues
    }
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
              <Button
                type="submit"
                colorScheme="teal"
                isLoading={false}
              >
                Submit
              </Button>
            </FormControl>
          </form>
        </Box>
      </Box>
    </>
  );
}

export default UploadVideoPage;
