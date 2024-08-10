import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'


import Login from './features/auth/Hlogin'
import Welcome from './features/auth/Welcome'
import RequireAuth from './features/auth/RequireAuth'
import Signin from './features/auth/Hsignin'
import LogOut from './features/auth/Hlogout'
import PersistLogin from './features/auth/PersistLogin'
import Prefetch from './features/auth/Prefetch'

import ProfileUpdateForm from './features/users/UserPr'
import SpeechToText from './features/users/record'
import User from './features/users/User'
import Recommend from './features/users/Recommendation'
import SinglePostPage from './features/users/SingleNotePage'
import EditPostForm from './features/users/EditNoteform'
import CreatePost from './features/users/NoteCreate'


import GetAlluserLoca from './features/loca/LocaUser'
import LocaCreate from './features/loca/LocaCreate'
import SingleLocaPage from './features/loca/SingleLocaPage'
import GetAllLoca from './features/loca/Loca'


import Buyrecommend from './features/users/Buyguild'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="registor" element={<Signin />} />
        <Route path="login" element={<Login />} />

        {/* protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route element={<Prefetch />}>
              <Route path="welcome" element={<Welcome />} />

              <Route path='record' element={<SpeechToText/>}/>

              {/* user && note */}
              <Route path="user">
                <Route index element={<User />} />
                <Route path="update" element={<ProfileUpdateForm/>} />
                <Route path="note">
                  <Route path="create" element={<CreatePost />} />
                  <Route path=":noteId" element={<SinglePostPage />} />
                  <Route path="edit/:noteId" element={<EditPostForm />} />
                </Route>
              </Route>

              <Route path="buyrecommend"element={<Buyrecommend/>}/>

              {/* location */}
              <Route path="location">
                <Route index element={<GetAllLoca />} />
                <Route path="ofuser" element={<GetAlluserLoca />} />
                <Route path=":noteId" element={<SingleLocaPage />}/>
                <Route path="create/:noteId" element={<LocaCreate />} />
              </Route>

              {/* recommend */}
              <Route path="recommend" element={<Recommend />} />
              <Route path="logout" element={<LogOut />} />
            </Route>
          </Route>
        </Route>

      </Route>
    </Routes>
  )
}

export default App;
