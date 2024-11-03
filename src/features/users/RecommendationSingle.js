import React, { useEffect, useState } from 'react'
import { useGetHowQuery } from './NoteApiSlice';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';

const RecommendationSingle = () => {

    const {id} = useParams()
    const  { data , isLoading : Loading , isSuccess: done} = useGetHowQuery();

    

    const dataFliter = data?.filter(val => val._id === id)

    console.log(dataFliter[0])
  
  return (
    <div className='page'>
        <Header/>
        <div>
            <h1>{dataFliter ? dataFliter[0]?.food : null}</h1>
            <p>{dataFliter ? dataFliter[0]?.des : null}</p>
        </div>
    </div>
  )
}

export default RecommendationSingle