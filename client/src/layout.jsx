import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

function Layout() {
  const [user, setUser] = useState(null);

  // check if user is logged in
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  return (
    <>
      <Box minH='100vh' minW='100vw' maxW='frame' mx='auto'>
        <Box display='flex' flexDir='column' alignItems='center'>
          <Outlet />
        </Box>
      </Box>
    </>
  );
}

export default Layout;
