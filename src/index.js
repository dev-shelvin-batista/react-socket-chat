import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { Home } from "./pages/Home/Home";
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const io = require("socket.io-client");
const socket = io("http://localhost:4000");

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Navigate to="chat/login"/>} />
        <Route path="*" element={<Navigate to="chat/login"/>} />
        <Route path="/chat/login" element={<Login socket={socket} />}></Route>
        <Route path="/chat/home" element={<Home socket={socket} />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);