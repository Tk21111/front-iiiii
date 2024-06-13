import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Pubilc'
import Login from './features/auth/Hlogin'
import Welcome from './features/auth/Welcome'
import RequireAuth from './features/auth/RequireAuth'
import User from './features/users/User'
import Signin from './features/auth/Hsignin'
import Recommend from './features/users/Recommendtion'
import SinglePostPage from './features/users/SigleNotePage'
import EditPostForm from './features/users/EditNoteform'
import LocaCreate from './features/loca/UserEdit'
import LogOut from './features/auth/Hlogout'
import PersistLogin from './features/auth/PersistLogin'
import Prefetch from './features/auth/Prefetch'
import GetAllLoca from './features/loca/Giveto'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="registor" element={<Signin/>} />
        <Route path="login" element={<Login />} />
        ขห น่ารัก
        {/* protected routes */}
        <Route element={<PersistLogin/>}>
          <Route element={<RequireAuth/>}>
            <Route element={<Prefetch/>}>
              <Route path="welcome" element={<Welcome />} />
              <Route path="user" element={<User />} />
              <Route path="user/note/:noteId" element={<SinglePostPage />} />
              <Route path="user/note/edit/:noteId" element={<EditPostForm />} />
              <Route path="recommend" element={<Recommend/>} />
              <Route path="location/create" element={<LocaCreate/>} />
              <Route path="location" element={<GetAllLoca/>} />
              <Route path="logout" element={<LogOut/>} />
            </Route>
          </Route>
        </Route>
        

      </Route>
    </Routes>
  )
}

export default App;