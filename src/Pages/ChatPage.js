import React, {useState} from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/Miscellaneous/SideDrawer'
import MyChats from '../components/Miscellaneous/MyChats'
import ChatArea from '../components/Miscellaneous/ChatArea'


const ChatPage = () => {
  const {user}=ChatState();
  const [fetchAgain, setFetchAgain] = useState(false)
  return (
    <div style={{width:"100%"}}>
        {user && <SideDrawer/>}
        <Box 
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91vh"
        p="10px"
        >
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && <ChatArea fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </Box>
    </div>
  )
}

export default ChatPage