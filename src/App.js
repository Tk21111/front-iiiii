import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Hlogin'
import Welcome from './features/auth/Welcome'
import RequireAuth from './features/auth/RequireAuth'
import User from './features/users/User'
import Signin from './features/auth/Hsignin'
import Recommend from './features/users/Recommendation'
import SinglePostPage from './features/users/SingleNotePage'
import EditPostForm from './features/users/EditNoteform'
import EditLocaForm from './features/loca/EditLocaform'
import CreatePost from './features/users/NoteCreate'
import LocaCreate from './features/loca/UserEdit'
import SingleLocaPage from './features/loca/SingleLocaPage'
import LogOut from './features/auth/Hlogout'
import PersistLogin from './features/auth/PersistLogin'
import Prefetch from './features/auth/Prefetch'
import GetAllLoca from './features/loca/Loca'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="register" element={<Signin />} />
        <Route path="login" element={<Login />} />

        {/* protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route element={<Prefetch />}>
              <Route path="welcome" element={<Welcome />} />

              {/* user && note */}
              <Route path="user">
                <Route index element={<User />} />
                <Route path="note">
                  <Route path="create" element={<CreatePost />} />
                  <Route path=":noteId" element={<SinglePostPage />} />
                  <Route path="edit/:noteId" element={<EditPostForm />} />
                </Route>
              </Route>

              {/* location */}
              <Route path="location">
                <Route index element={<GetAllLoca />} />
                <Route path=":noteId" element={<SingleLocaPage />}/>
                <Route path="create" element={<LocaCreate />} />
                <Route path="edit/:noteId" element={<EditLocaForm />} />
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
