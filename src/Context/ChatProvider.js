import { createContext,useContext, useState,useEffect } from "react";
import { useNavigate,useLocation } from 'react-router-dom';

const ChatContext=createContext();

const  ChatProvider=({children})=>{
    let navigate=useNavigate();
    const location = useLocation();
    const [user,setUser]=useState();
    const [selectedChat,setSelectedChat]=useState();
    const [chats,setChats]=useState([]);
    const [notification, setNotification] = useState([])

    useEffect(() => {
        const userInfo=JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        if(!userInfo){
            navigate("/")
        }
    }, [location.pathname]);
    
    return(
        <ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chats,setChats,notification, setNotification}}>
            {children}
        </ChatContext.Provider>
    )
};

export const ChatState=()=>{
    return useContext(ChatContext);
}
export default ChatProvider;