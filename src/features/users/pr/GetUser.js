import React, { useState, useEffect } from 'react';
import { useGetAllInfoUserMutation, useGetAllNoteUserMutation, useGetUserMutation } from '../NoteApiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../../components/Header';

const GetUser = () => {
    const userId = useParams();

    const navigate = useNavigate();

    const [getUser, { data, isLoading, isSuccess, isError, error }] = useGetUserMutation();
    const [getInfo, { data: dataList }] = useGetAllInfoUserMutation();
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!hasFetched) {
                    await getUser({ userId: userId.userId });
                    await getInfo({ user: userId.userId });
                    setHasFetched(true);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [hasFetched]);

    const imagePath = data?.image?.map(p => p?.url);



    console.log(dataList)

    return (
        <div className='page'>
            <Header />
            <div className='single-parent'>
                {imagePath && imagePath.length > 0 ? (
                    imagePath.map((path, i) => (
                        <img
                            key={i}
                            src={path}
                            alt={`note image ${i}`}
                            style={{ flexGrow: 1, maxWidth: 300, maxHeight: 300, margin: "5%" }}
                        />
                    ))
                ) : (
                    <p>No image</p>
                )}
                <h2>{"Name: " + (data?.username || 'No data')}</h2>
                <h2>{"Aka: " + (data?.aka || 'No data')}</h2>
                <p>{"More: " + (data?.more || 'No data')}</p>
                <p>{"Note stat: " + dataList?.[0]}</p>
                <p>{"Loca stat: " + dataList?.[1]}</p>
                
                {/* Display entity _id values */}
                <div>
                    <h3>RECOMMENDs :</h3>
                    <ul>
                        {dataList?.[2]?.map(val => (
                            <li key={val._id}><li><p onClickCapture={()=> navigate(`/recommend/${val._id}`)} style={{ textDecoration: 'underline' }}>view all</p></li>{val.name}</li>
                        ))}
                    </ul>
                </div>

                {/* Display comment _val values */}
                <div>
                    <h3>POSTs :</h3>
                    <ul>
                        {dataList?.[3].map(val => (
                            <li key={val._id}><li><p onClickCapture={()=> navigate(`/post/true/${val._id}`)} style={{ textDecoration: 'underline' }}>view all</p></li>{val.content}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default GetUser;
