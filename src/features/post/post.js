import React, { useEffect, useState } from 'react';
import { useGetPostQuery } from './PostApiSlice';
import Header from '../../components/Header';
import PostsExcerpt from './posExcerpt';
import Overay from '../../components/Overlay';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';
import { Link, useParams } from 'react-router-dom';

const Post = () => {
  const { data, isLoading, isSuccess } = useGetPostQuery();
 
  const [post, setPost] = useState(null);
  const [page, setPage] = useState(0);
  const { user } = useParams();

  const username = useSelector(selectCurrentUser)

  useEffect(() => {
    if (data && !post) {
      setPost(data);
    }
  }, [data]);

  let content;
  let lContent;

  

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (post) {

    content = post.ids.map((val) => {
      let postItem = post.entities[val];

      if (postItem?.userlist?.length > 0) {
        if (!postItem?.userlist.includes(username)) {
            return null;
        }
    }
    if (postItem?.userlist?.length === 0 && user === 'true') {
        return null;
    }
    // Filter out reply comments
    if (postItem?.reply) {
        return null;
    }
     

      const imagePath = postItem?.images?.map(image => `${process.env.REACT_APP_API}/${image.replace(/\\/g, '/')}`);
      return (
        <PostsExcerpt key={val} i={postItem} />
      );
    });

    lContent = content.length / 24
    content = content?.slice(24 * page, 24 * (page + 1));

  } else {
    content = <p>No posts available</p>;
  }

  return (
    <div className='page'>
      <Header />
      <div className='content' >
            <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
            <p style={{ marginRight : 'auto'}} className='welcomefont'><Link to="/save" >Post</Link></p>
        </div>
      <Overay link={'/post/false/create/null'} />
      <div className='user-list-parent'>{content}</div>
      <div className="page-control">
                <button onClick={() => setPage(page - 1)}  disabled={page === 0}>
                   {"<"}
                </button>
                <button onClick={() => setPage(page + 1)} disabled={page + 1> lContent }>
                    {">"}
                </button>
            </div>
      
    </div>
  );
};

export default Post;
