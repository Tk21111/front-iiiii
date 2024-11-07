import React, { useEffect, useState } from 'react';
import { useGetPostQuery } from './PostApiSlice';
import Header from '../../components/Header';
import PostsExcerpt from './postExcerpt';

const Post = () => {
  const { data, isLoading, isSuccess } = useGetPostQuery();
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (data) {
      setPost(data);
    }
  }, [data]);

  let content;

  

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (post) {

    console.log(post)
    content = post.ids.map((val) => {
      const postItem = post.entities[val];

      const imagePath = postItem?.images.map(image => `${process.env.REACT_APP_API}/${image.replace(/\\/g, '/')}`);
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
      {content}
    </div>
  );
};

export default Post;
