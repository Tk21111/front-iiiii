import React, { useEffect, useState } from 'react';
import { useGetHowQuery } from './NoteApiSlice';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';

const RecommendationSingle = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetHowQuery();
  
  const dataFliter = data?.filter(val => val._id === id);
  let imagePath = '';

  // Make sure data is available and image path is correctly formed
  if (dataFliter && dataFliter.length > 0) {
    imagePath = dataFliter[0].images.map(image => `${process.env.REACT_APP_API}/${image.replace(/\\/g, '/')}`);
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading data</p>;
  }

  return (
    <div className='page'>
      <Header />
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
            <h1>{dataFliter[0].food}</h1>
            <p>{dataFliter[0].des}</p>
          </>
        ) : (
          <p>No data found</p>
        )}
      </div>
    </div>
  );
}

export default RecommendationSingle;
