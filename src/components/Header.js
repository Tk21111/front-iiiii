import '../index.css';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Link, useNavigate } from 'react-router-dom'; 

import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { selectCurrentUser , selectCurrentAka , selectCurrentImage} from '../features/auth/authSlice'



function Header() {

    const navigate = useNavigate();
    
    const [isOpen, setIsOpen] = useState(false);
    
    const user = useSelector(selectCurrentUser)
    const aka = useSelector(selectCurrentAka);
    const image = useSelector(selectCurrentImage);

    const imagePath = `http://localhost:3500/${image?.toString().replace(/\\/g, '/')}`;


    const toggleDrawer = (open) => (event) => {
      if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
      setIsOpen(open);
    };

    return (
        <header className="header">
            <div className='headerComp' >
                
                <img onClick={() => {navigate(-1)}}src="./image copy 2.png" alt="back" className="logo" />
                
            </div>
            <div className='headerComp' >
                <a href="/welcome">
                    <img src="./image copy.png" alt="home" className="logo" />
                </a>
            </div>
            <nav className='headerComp'>
                
                <a href="/">
                    <img src="./image.png" alt="noti" className="logo" />
                </a>
                <img onClick={toggleDrawer(true)} src="./menu.png" alt="menu" className="logo" />
                
                
            </nav>
            <Drawer content='space-between' anchor= "right" open={isOpen} onClose={toggleDrawer(false)}>
            <List >
                <ListItem button component={Link} to="/welcome" onClick={toggleDrawer(false)}>
                    Home
                </ListItem>
                <ListItem button component={Link} to="/user/update" onClick={toggleDrawer(false)}> 
                    Change infomation
                </ListItem>
                <img src={imagePath} alt="note image" style={{flexGrow: 1 , maxWidth: 300 , maxHeight: 300, margin : "5%"  }} />
            </List>
            <List>
                <ListItem button component={Link} to="/logout" onClick={toggleDrawer(false)}> 
                    logout
                </ListItem>
                <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
                    Contact
                </ListItem>
            </List>
            </Drawer>
        </header>
    );
}

export default Header;
