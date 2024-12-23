import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import EditorPage from './pages/EditorPage.jsx'
import { Toaster } from 'react-hot-toast'


function App() {
  return (
    <>
      <div>
        <Toaster position='top-right' toastOptions={{
          success: {
            theme: {
              primary: "#4aed88"
            }
          }
        }}></Toaster>
      </div>
      <Routes>
        <Route path='/'  element={<Home />}/>
        <Route path='/editor/:roomId'  element={<EditorPage />}/>
      </Routes>
    </>
  )
}

export default App
