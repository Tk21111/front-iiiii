import React, { useEffect, useState } from 'react';
import { selectAllposts, useGetPostQuery } from './PostApiSlice';
import Header from '../../components/Header';
import PostsExcerpt from './posExcerpt';
import Overay from '../../components/Overlay';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';
import { Link, useParams } from 'react-router-dom';
import filterEntitiesByTag from '../users/comp/Search';
import { selectAllLocas } from '../loca/LocaApiSlice';
import { selectAllNotes } from '../users/NoteApiSlice';

const Post = () => {
  const { data, isLoading, isError , error} = useGetPostQuery();
 
  const [post, setPost] = useState(null);
  const [page, setPage] = useState(0);
  const { user } = useParams();
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("title");

  const username = useSelector(selectCurrentUser)

  useEffect(() => {
    if (data && !post) {
      setPost(data);
    }
  }, [data]);

  let content;
  let lContent;

  console.log(useSelector(selectAllposts))

  

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (post) {

    let idList ;

    if(search){
      const idTmp = filterEntitiesByTag(post.entities , search , searchType , false)
      idList = Object.keys(idTmp)
    } else {
      idList = post.ids
    }


    //so well
    content = idList.map((val) => {
      let postItem = post.entities[val];

      if (postItem?.userlist?.length > 0) {
        if (!postItem?.userlist.includes(username)) {
            return null;
        }
      }
      //no uselist 
      if (postItem?.userlist?.length === 0 && user === 'true') {
          return null;
      }
      // Filter out reply comments
      if (postItem?.reply) {
          return null;
      }

      return (
        <PostsExcerpt key={val} i={postItem} />
      );
    })?.filter(val => val != null);

    lContent = content?.length / 24
    content = content?.length > 0 ? content?.slice(24 * page, 24 * (page + 1)) :  null
  } else if (isError){
    if(error.status === '400'){
      content = <p>No posts yet</p>;
    } else {
      content = <p>{JSON.stringify(error)}</p>
    }
    
  }


  return (
    <div className='page'>
      <Header />
      {/* search comp*/}
        <div className="search">
          <img
            src={require("../../components/img/search.png")}
            alt="icon"
            style={{ marginLeft: "8px" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="selection"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="content">Content</option>
          <option value="user.username">Username</option>
          <option value="user.aka">Aka</option>
        </select>
      {/*end search comp*/}

      <div className='content' >
            <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
            <p style={{ marginRight : 'auto'}} className='welcomefont'><Link to="/save" >Post</Link></p>
      </div>
      <Overay link={'/post/false/create/null'} />
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

export default Post;
