import { Box } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"

function Layout() {
  

  return (
    <>
      <Box minH='100vh' maxW='frame' mx='auto'>
        <Outlet />
      </Box>
    </>
  )
}

export default Layout