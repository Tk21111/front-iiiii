import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Pubilc'
import Login from './features/auth/Hlogin'
import Welcome from './features/auth/Welcome'
import RequireAuth from './features/auth/RequireAuth'
import UsersList from './features/users/UsersList'
import User from './features/users/User'
import UsergetNum from './features/users/UserGetNum'
import Signin from './features/auth/Hsignin'
import UsergetWho from './features/users/UserGetWho'
import Usercheck from './features/users/UserCheck'
import AdminGive from './features/users/AdminGive'
import LogOut from './features/auth/Hlogout'
import PersistLogin from './features/auth/PersistLogin'
import Prefetch from './features/auth/Prefetch'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="registor" element={<Signin/>} />
        <Route path="login" element={<Login />} />

        {/* protected routes */}
        <Route element={<PersistLogin/>}>
          <Route element={<RequireAuth/>}>
            <Route element={<Prefetch/>}>
              <Route path="welcome" element={<Welcome />} />
              <Route path="userslist" element={<UsersList />} />
              <Route path="user" element={<User />} />
              <Route path="usergetnum" element={<UsergetNum />} />
              <Route path="usergetwho" element={<UsergetWho/>} />
              <Route path="usercheck" element={<Usercheck/>} />
              <Route path="admincmd" element={<AdminGive/>} />
              <Route path="logout" element={<LogOut/>} />
            </Route>
          </Route>
        </Route>
        

      </Route>
    </Routes>
  )
}

export default App;