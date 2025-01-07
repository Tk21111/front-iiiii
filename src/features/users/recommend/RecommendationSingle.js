import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAllNotes, useDeleteHowMutation, useGetHowQuery } from '../NoteApiSlice';
import Header from '../../../components/Header';
import { listNew } from '../comp/menu';
import { translate } from '../../../hooks/translator';

const RecommendationSingle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetHowQuery();
  const [deleteHow] = useDeleteHowMutation();

  const realId = id?.split('!!')[0];

  let dataFliter = data?.find(val => val._id === realId);
  if (id.split('=')[0] === 'own') {
    const menuId = id.split('=')[1].split('!!')[0][0];
    const menuIdSub = id.split('=')[1].split('!!')[0][1];
    dataFliter = listNew[menuId][1][menuIdSub];
    dataFliter.tag = listNew[menuId][0];
  }

  const imagePath = dataFliter?.images?.map(image => image?.url || null);



  const isDeleteDisabled = id.split('=')[0].split('!!')[0] === 'own';

  const isHighlighted = (tag) => {
    const tagParts = id?.split('=')[1]?.split('!!')[1]?.split(',');
    return tagParts?.includes(tag) || id?.split('!!')[1]?.includes(tag);
  };

  const handleDelete = async () => {
    try {
      await deleteHow({ id: realId }).unwrap();
      navigate('/recommend');
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data</p>;


  let ingredentList = (dataFliter?.ingredent ? dataFliter?.ingredent.map(val => [val.name , val.quantity , val.unit]) : [])


  return (
    <div className="page">
      <Header />
      <div className="single-parent">
        <div>
          {imagePath ? (
            imagePath.map((path, i) => (
              <img
                key={i}
                src={path}
                alt={`note image ${i}`}
                style={{ flexGrow: 1, maxWidth: 300, maxHeight: 300, margin: '5%' }}
              />
            ))
          ) : (
            <p>No images available</p>
          )}
          {dataFliter ? (
            <div>
              <h1>{dataFliter?.name}</h1>
              {ingredentList.map(val => <p>{val[0] + "  : " + val[1] + " " + val[2]}</p>)}
              <div className="tag-container">
                {dataFliter?.tag?.map((val, i) => (
                  <p
                    key={i}
                    className="tag-child"
                    style={isHighlighted(val) ? { backgroundColor: '#B0E7FF' } : { opacity: 0.5 }}
                  >
                    {val}
                  </p>
                ))}
              </div>
              <p>{dataFliter?.des}</p>
            </div>
          ) : (
            <p>No data found</p>
          )}
        </div>
        <button onClick={handleDelete} disabled={isDeleteDisabled}>
          {translate("delete")}
        </button>
      </div>
    </div>
  );
};

export default RecommendationSingle;
