import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import { useGetAllnoteQuery, useGetNotiQuery, useSetNotiMutation } from './NoteApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';

const Noti = () => {
  const user = { username: useSelector(selectCurrentUser) };

  const { data: users, isLoading, isSuccess, isError, error } = useGetAllnoteQuery(('noteUser', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  }));

  const [setNoti] = useSetNotiMutation();
  const { data: notiData, isLoading: loading } = useGetNotiQuery();

  const [hasFetched, setHasFetched] = useState(false);
  const [newNoti, setNewNoti] = useState(null);
  const [content, setContent] = useState([]);


  useEffect(() => {
    // Function to generate a random note and create notification object
    const generateNote = () => {
      if (users) {
        let canInSult = false;
        let i = 0;
        let noteObj = null;

        while (!canInSult && i < 5) {
          i++;
          noteObj = users.entities[users.ids[Math.floor(Math.random() * users.ids.length)]];
          if (noteObj.count < noteObj.countExp) {
            canInSult = true;
          }
        }

        const currentDate = new Date
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth()).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        const notiObject = {
          text: noteObj?.text || "No text available",
          count: noteObj?.count || 0,
          countExp: noteObj?.countExp || 0,
          status: canInSult ? "expiring" : "good",
          date : formattedDate
        };

        setNewNoti(notiObject);

        return notiObject;
      }
      return null;
    };

    if (users) {
      generateNote();
    }
  }, [users]);

  useEffect(() => {
    const fetchNoti = async (notiToSet) => {
      if (notiToSet) {
        try {
          await setNoti({ noti: notiToSet });
          console.log('Notification sent.');
        } catch (err) {
          console.error("Error sending notification:", err);
        }
      }
    };

    if (newNoti) {
      fetchNoti(newNoti);
    }
  }, [newNoti, setNoti]);

  const renderNotification = (notiObject) => {
    return (
      <div className="food-waste-item">
        
         <div className='food-waste-front'>
            <img src={require('../../components/img/broccoli.png')} alt="meat icon" className='smalllogolist' />
          </div>
          <div className='overcontent'>
            <div className="food-waste-content">
              <div className="food-waste-details">
                <h2>{notiObject.text}</h2>
                  {notiObject.status === "expiring" ? (
                    <p>{`You have ${notiObject.count}, and only ${notiObject.countExp} will expire soon.`}</p>
                        ) : (
                    <p>You're good!</p>
                    
                  )}
                  
              </div>
                            
            </div>
         </div> 
         <p style={{fontSize : '50%' , justifyContent: 'start'}}>{notiObject?.date}</p>
      </div>
      
    );
  };


  return (
    <div className="page">
      <Header />
      <div className="overcontent">
        <div className="content">
          <img src={require('../../components/img/star.png')} alt="star" className="smalllogo" />
          <p style={{ marginRight: 'auto' }} className="welcomefont">
            <Link to="/user/shopping/false/false/null">Notifications</Link>
          </p>
        </div>
        {newNoti && renderNotification(newNoti)}
        {notiData?.length > 0 && notiData?.map((item, index) => (
          <React.Fragment key={index}>{renderNotification(item)}</React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Noti;
