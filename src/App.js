import {Routes,Route} from "react-router-dom";
import './App.css';
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import axios from 'axios';
axios.defaults.baseURL="https://codechat-backend.onrender.com/";
function App() {
  return (
    <div className="App">
      <Routes>
          <Route exact path="/" element={<HomePage/>} />
          <Route exact path="/chats" element={<ChatPage/>} />
        </Routes>
    </div>
  );
}

export default App;
