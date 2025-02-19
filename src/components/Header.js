import '../index.css';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import ReactDom from 'react-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Link, useNavigate, useParams } from 'react-router-dom'; 
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectCurrentAka, selectCurrentImage } from '../features/auth/authSlice';

import { switchLanguage , translate } from '../hooks/translator';

function Header() {
  const navigate = useNavigate();
  const p = useParams();
  const [isOpen, setIsOpen] = useState(false);


  const user = useSelector(selectCurrentUser);
  const aka = useSelector(selectCurrentAka);
  const image = useSelector(selectCurrentImage);
  

  const handleSwitch = () => {
    switchLanguage();
    };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  return ReactDom.createPortal(
    <header className="header" style={{zIndex : 909}}> 
      <div className='headerComp'>
        <img onClick={() => { navigate(-1); }} src={require('../components/img/back.png')} alt="back" className="logo" />
      </div>
      <div className='headerComp'>
        <a href="/welcome">
          <img src={require('../components/img/logoapp.png')} alt="home" className="logo" style={{marginLeft: '50%' ,width : '80%' }} />
        </a>
      </div>
      <nav className='headerComp'>
        {p['*'] === '' ? <a href="/login">
          <h2 style={{textAlign : 'center' , fontSize : '60%' , marginRight: '20px', color: 'black'}}>login</h2>
        </a> : null}
        <a href="/notifications">
          <img src={require('../components/img/noti.png')} alt="noti" className="logo" />
        </a>
        <img onClick={toggleDrawer(true)} src={require('../components/img/menu.png')} alt="menu" className="logo"  style={{width : '30%' }} />
      </nav>
      <Drawer content='space-between' anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
        <List>
          <ListItem button component={Link} to="/welcome" onClick={toggleDrawer(false)}>
            หน้าหลัก
          </ListItem>
          <ListItem button component={Link} to="/user/update" onClick={toggleDrawer(false)}>
            แก้ไขโปรไฟล์
          </ListItem>
          <ListItem button component={Link} to="/save" onClick={toggleDrawer(false)}>
            ดูโพสต์ที่เก็บไว้
          </ListItem>
          <ListItem button component={Link} to="/getuser" onClick={toggleDrawer(false)}>
            getUserAdmin
          </ListItem>
          <ListItem button component={Link} onClick={() => {handleSwitch() ; toggleDrawer(false);}}>
            {translate("changeLang")}
          </ListItem>
          {image ? <img src={image[0]?.url} alt="note image" style={{ flexGrow: 1, maxWidth: 300, maxHeight: 300, margin: "5%" }} /> : <p>on img</p>}
        </List>
        <List>
          <ListItem button component={Link} to="/logout" onClick={toggleDrawer(false)}>
            ออกจากระบบ
          </ListItem>
          <ListItem button component={Link} to="/contract" onClick={toggleDrawer(false)}>
            ติดต่อ
          </ListItem>
        </List>
      </Drawer>
    </header>, document.body
   
  );
}

export default Header;
