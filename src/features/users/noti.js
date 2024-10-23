import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import { useGetAllNoteUserMutation, useGetNotiQuery, useSetNotiMutation } from './NoteApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';

const Noti = () => {
  const user = { username: useSelector(selectCurrentUser) };

  const [getAllNoteUser, { data: users, isLoading, isSuccess, isError, error }] = useGetAllNoteUserMutation(('noteUser', {
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
    const fetchData = async () => {
      try {
        if (!hasFetched) {
          await getAllNoteUser(user);
          setHasFetched(true);
          console.log('fetched');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [hasFetched]);

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

        const notiObject = {
          text: noteObj?.text || "No text available",
          count: noteObj?.count || 0,
          countExp: noteObj?.countExp || 0,
          status: canInSult ? "expiring" : "good"
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
        <div className="noti-content">
          <h2>{notiObject.text}</h2>
          {notiObject.status === "expiring" ? (
            <p>{`You have ${notiObject.count}, and only ${notiObject.countExp} will expire soon.`}</p>
          ) : (
            <p>You're good!</p>
          )}
        </div>
      </div>
    );
  };

  console.log(notiData)
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
