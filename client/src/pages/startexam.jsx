import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Button,
    Input
  } from '@chakra-ui/react'

import { Field, Form, Formik } from 'formik';

function StartExamPage() {
    function validateToken(value) {
      let error
      if (!value) {
        error = 'Token is required'
      } else if (value.toLowerCase() !== '1234') {
        error = "Wrong Token"
      }
      return error
    }
  
    return (
      <Formik
        initialValues={{ Token: 'Token Here' }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            actions.setSubmitting(false)
          }, 1000)
        }}
      >
        {(props) => (
          <Form>
            <Field name='token' validate={validateToken}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.name && form.touched.name}>
                  <FormLabel>Input your exam token</FormLabel>
                  <Input {...field} placeholder='Token Here' />
                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Button
              mt={4}
              colorScheme='teal'
              isLoading={props.isSubmitting}
              type='Start Exam'
            >
              Start Exam
            </Button>
          </Form>
        )}
      </Formik>
    )
  }

  export default StartExamPage