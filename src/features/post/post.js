import React, { useEffect, useState } from 'react';
import { useGetPostQuery } from './PostApiSlice';
import Header from '../../components/Header';
import PostsExcerpt from './PostExcerpt';
import Overay from '../../components/Overlay';
import filterEntitiesByTag from '../users/Search';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';

const Post = () => {
  const { data, isLoading, isSuccess } = useGetPostQuery();
  const [post, setPost] = useState(null);

  const username = useSelector(selectCurrentUser)

  useEffect(() => {
    if (data) {
      setPost(data);
    }
  }, [data]);

  let content;

  

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (post) {

    content = post.ids.map((val) => {
      let postItem = post.entities[val];

     

      const imagePath = postItem?.images?.map(image => `${process.env.REACT_APP_API}/${image.replace(/\\/g, '/')}`);
      return (
        <PostsExcerpt key={val} i={postItem} />
      );
    });
  } else {
    content = <p>No posts available</p>;
  }

  return (
    <div className='page'>
      <Header />
      <Overay link={'/post/false/create/null'} />
      {content}
    </div>
  );
};

export default Post;
