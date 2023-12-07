import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Input,
  Box,
  Heading,
  FormHelperText
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { Link as RouterLink } from 'react-router-dom';

function StartExamPage() {
  async function handleSubmit(values, actions) {
    try {
      console.log(values.token)
      //  TODO : change the url to the deployed backend
      const response = await fetch('http://localhost:5000/start_exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: values.token }),
      });
      
      const responseData = await response.json();
      console.log(responseData)

      if (response.ok) {
        window.location.href = '/exam';
      } else {
        actions.setFieldError('token', responseData.error || "Token doesn't exist");
      }
    } catch (error) {
      console.error('Error while making API call:', error);
      actions.setFieldError('token', error.message);
    }
  
    actions.setSubmitting(false);
  }

  function validateInput(value) {
    let error;
    if (!value) {
      error = 'Token is required';
    }
    return error;
  }
  

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
          Start Exam
        </Heading>
      </Box>
        <Box
          display='flex'
          flexDir='column'
          alignItems={"center"}
          justifyContent={"center"}
          w='100%' h={"100%"}
        >
          <Formik
            initialValues={{ token: '' }}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form>
                <Field name="token" validate={validateInput}>
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.token && form.touched.token}
                    >
                      <FormLabel htmlFor="token"
                        fontSize={"xl"}
                      >Token</FormLabel>
                      <FormHelperText
                        mb='4'
                      >Enter the token that you get earlier</FormHelperText>
                      <Input 
                        {...field} 
                        id="token" 
                        placeholder="token" 
                        backgroundColor={"white"}
                        color={"black"}
                      />
                      <FormErrorMessage>{form.errors.token}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Button
                  mt={4}
                  colorScheme="blue"
                  // eslint-disable-next-line react/prop-types
                  isLoading={props.isSubmitting}
                  type="submit"
                  width={"100%"}
                >
                  Start
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </>
  );
}

export default StartExamPage;
