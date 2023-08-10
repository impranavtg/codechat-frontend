import { ChatIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../../config/ChatLogics";
import ChatLoading from "../ChatLoading";
import GroupChatModal from "./GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { Avatar } from "@chakra-ui/avatar";
import {AES,enc} from 'crypto-js';
const SECRET_KEY = "0mzt3amdht5cstbhmr7hmdktr@s";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();
  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          authToken:user.token,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Some Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  const decryptMessage = (ciphertext)=>{
      const bytes  = AES.decrypt(ciphertext,  SECRET_KEY);
      const originalText = bytes.toString(enc.Utf8);
      return originalText;
  }

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<ChatIcon />}
          >
            Create Group
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        // bg="white"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#3CCF4E" : "#D4F6CC"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                display="flex"
                // justifyContent="space-between"
                borderRadius="lg"
                key={chat._id}
              >
               <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
        src={!chat?.isGroupChat
                    ? chat?.latestMessage?.sender?.dp
                    : chat?.chatName}
      />
      <Box display="flex" flexDirection="column">
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender._id===user._id?"You":chat.latestMessage.sender.name} : </b>
                    {decryptMessage(chat.latestMessage.content).length > 50
                      ? decryptMessage(chat.latestMessage.content).substring(0, 51) + "..."
                      : decryptMessage(chat.latestMessage.content)}
                  </Text>
                  
                )}
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;