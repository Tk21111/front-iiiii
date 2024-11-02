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

import GetUser from './features/users/GetUser'
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


import HowStor from './features/users/HowStor'
import Static from './features/users/Static'
import GetAllNoteUserExp from './features/users/UserExp'
import ShoppingList from './features/users/ShoppingList'
import GetOrg from './features/loca/LocaOrg'
import GetOrgSingle from './features/loca/LocaOrgSingle'
import Noti from './features/users/noti'
import AddressFormWithMap from './features/loca/testLoca'
import RecommendationCreate from './features/users/RecommendationCreate'

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
              <Route path='getuser/:userId' element={<GetUser/>}/>

              {/* user && note */}
              <Route path="user">
                <Route index element={<User />} />
                <Route path="shopping/:select/:donate/:name" element={<ShoppingList/>}/>
                <Route path="exp" element={<GetAllNoteUserExp/>}/>
                <Route path="update" element={<ProfileUpdateForm/>} />
                <Route path="note">
                  <Route path="create" element={<CreatePost />} />
                  <Route path=":noteId" element={<SinglePostPage />} />
                  <Route path="edit/:noteId" element={<EditPostForm />} />
                </Route>
              </Route>

              <Route path="static"element={<Static/>}/>
              <Route path="notifications"element={<Noti/>}/>
              <Route path="store/:type"element={<HowStor/>}/>

              {/* location */}
              <Route path="location">
                <Route index element={<GetAllLoca />} />
                <Route path="ofuser" element={<GetAlluserLoca />} />
                <Route path="oforg" >
                  <Route index element={<GetOrg/>}/>
                  <Route path=":id" element={<GetOrgSingle/>}/>
                </Route>
                <Route path=":noteId" element={<SingleLocaPage />}/>
                <Route path='test' element={<AddressFormWithMap/>} />
                <Route path="create/:noteId/:amount" element={<LocaCreate />} />
              </Route>

              {/* recommend */}
              <Route path="recommend">
                <Route index element={<Recommend/>} />
                <Route path='create' element={<RecommendationCreate/>} />
              </Route>

              <Route path="logout" element={<LogOut />} />
            </Route>
          </Route>
        </Route>

      </Route>
    </Routes>
  )
}

export default App;
