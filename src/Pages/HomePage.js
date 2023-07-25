import { Box, Container, Text,Tabs,TabList,Tab,TabPanel,TabPanels } from '@chakra-ui/react'
import React, {useEffect} from 'react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useNavigate,useLocation } from 'react-router-dom';

const HomePage = () => {
   let navigate=useNavigate();
    const location = useLocation();
    useEffect(() => {
        const userInfo=JSON.parse(localStorage.getItem("userInfo"));

        if(userInfo){
            navigate("/chats")
        }
    }, [location.pathname]);
  return (
    <Container maxW="xl" centerContent>
    <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="#D4F6CC"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
    >
        <Text fontSize="4xl" fontFamily="work sans" color="black" textAlign="center" >CodeChat</Text>
    </Box>
    <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded" colorScheme='green'>
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage