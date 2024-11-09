import { Outlet } from "react-router-dom";
import Notification from './Noti.js';

const Layout = () => {
    return (
        <div style={{display : 'flex'}}>
            {/* Add a header, sidebar, or any other persistent layout components here */}
           
            
            {/* Main content area for nested routes */}
            <Outlet />
        </div>
    );
};

export default Layout;
