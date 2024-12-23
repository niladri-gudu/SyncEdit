import { useState, useRef, useEffect } from "react";
import Client from "../components/Client.jsx";
import Editor from "../components/Editor.jsx";
import { initSocket } from "../../socket.js";
import toast from "react-hot-toast";
import ACTIONS from "../../Actions.js";
import Logo from '../assets/logo.png'

import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";

const EditorPage = () => {
  
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);
  
  const reactNavigator = useNavigate();
  
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on("connect-error", (err) => handleErrors(err));
      socketRef.current.on("connect-failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room`);
          console.log(`${username} joined`);
        }
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId
        })
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`)
        setClients((prev) => {
          return prev.filter(client => client.socketId !== socketId)
        })
      })

    };

    init();
    
    return () => {
      socketRef.current.off(ACTIONS.JOINED)
      socketRef.current.off(ACTIONS.DISCONNECTED)
      socketRef.current.disconnect();
    }
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard")
    } catch (error) {
      toast.error("Could not copy the Room ID!")
      console.error(error)
    }
  }

  function leaveRoom() {
    reactNavigator('/')
  }

  const [type, setType] = useState("");

  return (
    <div className="mainWrap flex h-screen">
      <div className="leftBox w-[280px] border-r-2 border-black">
        <div className="leftBoxInner">
          <div className="logo flex items-center justify-start">
            <img src={Logo} alt="logo" className="h-32" />
            <h1 className="font-bold text-2xl">SyncEdit</h1>
          </div>
          <h3 className="font-bold text-center pb-3 text-xl">Connected</h3>
          <div className="clientsList flex justify-center flex-wrap m-2 gap-1">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 m-3 bottom-0 fixed w-[250px]">
          <input
            className="px-3 py-1 border-2 border-black rounded-lg bg-gray-300 hover:bg-gray-400 cursor-pointer font-bold"
            type="button"
            onClick={copyRoomId}
            value="Copy Room ID"
          />
          <input
            className="px-3 py-1 border-2 border-black rounded-lg bg-red-600 hover:bg-red-700 cursor-pointer text-white font-bold"
            type="button"
            onClick={leaveRoom}
            value="Leave"
          />
        </div>
      </div>
      <div className="rightBox flex-grow h-full">
        <Editor className="h-full" value={type} onChange={setType} socketRef={socketRef} roomId={roomId} onCodeChange={(code) => {codeRef.current = code}} />
      </div>
    </div>
  );
};

export default EditorPage;
