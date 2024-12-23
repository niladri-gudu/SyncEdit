import { useState } from 'react';
import { v4 as uuidV4 } from 'uuid'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png'

const Home = () => {
  
  const navigate = useNavigate()

  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success('Created a new room')
  }

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error('Room ID and username is required')
      return;
    }

    toast.success('Room joined')

    navigate(`/editor/${roomId}`, {
      state: {
        username
      }
    })
  }

  const handleEnterInput = (e) => {
    if (e.code === 'Enter') {
      joinRoom();
    }
  }

  return (
    <div className="homePageWrapper flex items-center justify-center text-black h-screen">
      <div className="formWrapper bg-[#f0f0f0] p-[20px] rounded-[10px] w-[435px] max-w-[90%]">
        <div className="flex items-center">
          <img src={Logo} alt="logo" className="h-36" />
          <h1 className="font-bold text-4xl">SyncEdit</h1>
        </div>
        <h4 className="mainLabel text-xl px-2 pb-3">Paste Invitation Room ID</h4>
        <div className="inputGroup">
          <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} onKeyUp={handleEnterInput} className="inputBox border-2 rounded-lg px-4 py-2 w-full mb-2 focus:outline-none" placeholder="ROOM ID:" />
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} onKeyUp={handleEnterInput} className="inputBox border-2 rounded-lg px-4 py-2 w-full mb-2 focus:outline-none" placeholder="USERNAME:" />
          <input type="button" onClick={joinRoom} className="rounded-lg px-4 py-2 w-full bg-green-400 mb-4 cursor-pointer hover:bg-green-500" value="Join" />
          <span className="createInfo">If you dont have an invite code then create a &nbsp;
            <a onClick={createNewRoom} href="" className="createNewBtn text-green-500 underline">new room</a>
          </span>
        </div>
      </div>
      <footer className="fixed bottom-0 mb-3">
        <h4>Built with ❤️ by <a href="https://github.com/niladri-gudu">nILADRI</a></h4>
      </footer>
    </div>
  )
}

export default Home
