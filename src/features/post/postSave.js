import React, { useEffect, useState } from 'react';
import { useGetPostQuery, useGetSavePostQuery } from './PostApiSlice';
import Header from '../../components/Header';
import PostsExcerpt from './posExcerpt';
import Overay from '../../components/Overlay';
import filterEntitiesByTag from '../users/comp/Search';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';
import { Link } from 'react-router-dom';

const SavePost = () => {
  const { data, isLoading, isSuccess } = useGetSavePostQuery();
  const [post, setPost] = useState(null);
  const [page, setPage] = useState(0);

  const username = useSelector(selectCurrentUser)

  useEffect(() => {
    if (data) {
      setPost(data);
    }
  }, [data]);

  let content;
  let lContent;
  

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (post) {

    console.log(post)

    content = post?.map((val, i) => {
    
      return (
        <PostsExcerpt key={i} i={val} />
      );
    });

    lContent = content.length / 24
content = content.length > 0 ? content?.slice(24 * page, 24 * (page + 1)) :  null
  } else {
    content = <p>No posts available</p>;
  }

  return (
    <div className='page'>
      <Header />
      <Overay link={'/post/false/create/null'} />
        <div className='content' >
            <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
            <p style={{ marginRight : 'auto'}} className='welcomefont'><Link to="/save" >Saved Post</Link></p>
        </div>
      <div className='user-list-parent'>{content}</div>
      <div className="page-control">
                <button onClick={() => setPage(page - 1)}  disabled={page === 0} >
                   {"<"}
                </button>
                <button onClick={() => setPage(page + 1)} disabled={page + 1> lContent }>
                    {">"}
                </button>
            </div>
    </div>
  );
};

export default SavePost;
