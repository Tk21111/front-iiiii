import React, { useEffect, useState } from 'react';
import { selectAllNotes, useDeleteHowMutation, useGetHowQuery } from '../NoteApiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../../components/Header';
import { listNew } from '../comp/menu';
import { useSelector } from 'react-redux';

const RecommendationSingle = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetHowQuery();
  const [deleteHow] = useDeleteHowMutation()

  const navigate = useNavigate()

  const realId = id?.split('!!')[0]

  console.log(realId)
  
  let dataFliter = data?.filter(val => val._id === realId);

  let imagePath = '';

  // Make sure data is available and image path is correctly formed
  if (dataFliter && dataFliter.length > 0) {
    imagePath = dataFliter[0].images.map(image => `${process.env.REACT_APP_API}/${image.replace(/\\/g, '/')}`);
  }

  if(id.split('=')[0] === 'own'){
    const menuId = id.split("=")[1].split('!!')[0][0]
    const menuIdSub = id.split("=")[1].split('!!')[0][1]
    
    dataFliter = [listNew[menuId][1][menuIdSub]]
    dataFliter[0].tag = listNew[menuId][0]
  }

  console.log(dataFliter)
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading data</p>;
  }

  const handleDelete = async () => {
    try {
      await deleteHow({id : realId}).unwrap();
      // Optionally, navigate back to the post list or show a confirmation message
      navigate('/recommend')
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };


  return (
    <div className='page'>
      <Header />
      <div className='single-parent'>
          <div>
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
              <p>No images available</p>
            )}
            {dataFliter && dataFliter.length > 0 ? (
              <>
                <h1>{dataFliter[0]?.name}</h1>
                <p>{dataFliter[0]?.des}</p>
                <div className='tag-container'>
                {dataFliter[0]?.tag?.map(val => <p className='tag-child' style={id?.split("=")[1]?.split('!!')[1].split(",")?.includes(val) || id?.split("=")[1]?.split('!!')[1].includes(val) || id?.split('!!')[1].includes(val) || id?.split('!!')[1].split(",").includes(val) ? {backgroundColor : '#8fce88'} : {backgroundColor : '#B1AFAF'}}>{val}</p>)}
                </div>
                <p>{dataFliter[0]?.ingredent}</p>
              </>
            ) : (
              <p>No data found</p>
            )}
          </div>
          <button onClick={handleDelete} disabled={id.split('=')[0].split('!!')[0] === 'own'}>Delete </button>
        </div>
    </div>
  );
}

export default RecommendationSingle;
