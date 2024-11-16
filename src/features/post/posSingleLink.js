import React from 'react'
import LocasExcerpt from '../loca/LocaExcerpt';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';

const PostSingleLink = ({i}) => {

  const username = useSelector(selectCurrentUser)

  let content;

  if(i?.food){

    const data = i.food
    const imagePath = data?.images.map(image => `${process.env.REACT_APP_API}/${image.replace(/\\/g, '/')}`);

    content =  (
      <div className='single-parent'>
          {imagePath.map(val => <img className='post-single-img'src={val} alt='pic'/>)}
          <h2>{data.text}</h2>
          <p>{data.tag}</p>
          <h2>count</h2>
          <p>{data.count.toString()}</p>
          <h2>countExp</h2>
          <p>{data.countExp.toString()}</p>
      </div>
    )
  } else if (i?.how){

    const data = i.how
    const imagePath = data?.images?.map(image => `${process.env.REACT_APP_API}/${image.replace(/\\/g, '/')}`);

    content =  (
      <div className='single-parent'>
          {imagePath?.map(val => <img className='post-single-img'src={val} alt='pic'/>)}
          <h2>{data?.name}</h2>
          {data?.tag?.map(val => <p className='tag-child'>{val}</p>)}
          <p>{data?.des}</p>
          <p>{data?.ingredent}</p>
      </div>
    )
  } else if (i?.loca){
    const data =  i.loca;
    const own = data.user.username === username;
    const imagePath = data?.images?.map(image => `${process.env.REACT_APP_API}/${image.replace(/\\/g, '/')}`);

    content =  (
      <div className='single-parent'>
          {imagePath?.map(val => <img className='post-single-img'src={val} alt='pic'/>)}
          <h2>{data?.name}</h2>
          <p>{data?.num}</p>
          <p>{data?.more}</p>
          {/* own : true //make the locaSingle work when loca is not public anymore*/}
          <LocasExcerpt i={{...data , own : true}} own={own} />
      </div>
    )
  }
  
  return (
    <div className='post-single-link'>
      {content}
    </div>
  )
    
}

export default PostSingleLink