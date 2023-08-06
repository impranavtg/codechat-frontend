import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon,  SearchIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
// import { useHistory } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
// import NotificationBadge from "react-notification-badge";
// import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../UserAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
// import { ChatState } from "../../Context/ChatProvider";
import { useNavigate } from 'react-router-dom';

const SideDrawer = () => {
  const {user,setSelectedChat,chats,setChats,notification, setNotification}=ChatState();    
  let navigate=useNavigate();           
    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const [chatLoading,setChatLoading]=useState(false);

    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const logoutHandler=()=>{
      localStorage.removeItem("userInfo");
      navigate("/");
    }
    const handleSearch=async(query)=>{
      setSearch(query);
      if(!search){
        return;
      }

       try {
      setLoading(true);

      const config = {
        headers: {
          authToken:user.token,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    }

    const accessChat=async(userId)=>{
       try {
      setChatLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          authToken:user.token,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setChatLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    }
  return (
     <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#D4F6CC"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <SearchIcon/>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search Users
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          CodeChat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              {/* <NotificationBadge
                count={notification.length}
              /> */}
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
             {!notification.length && "No Notifications"}
             {notification.map(notify=>(
              <MenuItem key={notify._id} onClick={()=>{setSelectedChat(notify.chat);
              setNotification(notification.filter((n)=>n!==notify))}}>
                {notify.chat.isGroupChat?`New message in ${notify.chat.chatName}`:`New Message from ${getSender(user,notify.chat.users)}`}
              </MenuItem>
             ))}  
            </MenuList>
          </Menu>
          <Menu >
            <MenuButton as={Button} bg="#D4F6CC"  _hover={{bg:"#D4F6CC"}}  >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.dp}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search here..."
                // mr={2}
                value={search}
                // onChange={(e) => setSearch(e.target.value)}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {/* <Button onClick={handleSearch}>Go</Button> */}
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {chatLoading && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer