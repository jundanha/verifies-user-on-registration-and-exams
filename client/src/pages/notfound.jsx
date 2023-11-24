import { Box } from "@chakra-ui/react"

function NotFoundPage () {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      h="100vh"
      w='100vw'
    >
      <Box w="md" p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <h1>404 - Not Found</h1>
      </Box>
    </Box>
  )
}

export default NotFoundPage