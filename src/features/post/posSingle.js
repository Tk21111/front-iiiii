import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  useGetPostQuery, 
  useSetLikeMutation, 
  useCreateCommentMutation, 
  useGetCommentMutation,
  useDeletePostMutation, 
  useSavePostMutation,
  useGetSavePostQuery,
  selectAllposts
} from './PostApiSlice';
import PostsExcerpt from './posExcerpt';
import Header from '../../components/Header';
import PostSingleLink from './posSingleLink';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';
import { useGetUserMutation } from '../users/NoteApiSlice';


const PostSingle = () => {
  const { id } = useParams();
  const username = useSelector(selectCurrentUser);
  const { data: postsData, isLoading, isError } = useGetPostQuery();
  const [getUser] = useGetUserMutation()
  const [setLikeApi] = useSetLikeMutation();
  const [setFetchComment, {data : setComment}] = useCreateCommentMutation();
  const [getComment, { data: commentsData }] = useGetCommentMutation();
  const [deletePost] = useDeletePostMutation();
  const [savePost , {isSucess : saved}] = useSavePostMutation();

  const {data : savePostData } = useGetSavePostQuery();
  const [postSave , setPostSave] = useState([]);


  const [postSingle, setPostSingle] = useState(null);

  const [likeList , setLikeList] = useState([]);
  const [unLikeList , setUnLikeList] = useState([]);

  const [comments, setComments] = useState([]);
  const [newComment , setNewComment] = useState('');
  const [sendNewComment , SetSendNewcommnet] = useState(true)
  const [newImage , setnewImage] = useState([]);

  const [page, setPage] = useState(0);

  useEffect(() => {
    if (postsData && id) {
      let post = postsData.entities[id] // Adjust for object or array
     

      if (post) {
        setPostSingle(post);
        setLikeList(post.like)
        setUnLikeList(post.unlike)

      } else {
        console.error("Post not found in data");
      }
    }
  }, [postsData, id , isLoading ]);

  useEffect(()=> {
    if(savePostData){
      setPostSave(savePostData)
    }
  },[savePostData])

  //get comment
  useEffect(() => {
    const fetchComments = async () => {
      if (postSingle?._id) {
        try {
          const fetchedComments = await getComment({ id: postSingle._id }).unwrap();
          setComments(fetchedComments || []);
          SetSendNewcommnet(false)
        } catch (error) {
          if(error.originalStatus === 404){
            //alert('comment not found');
          }else { 
            console.error("Failed to fetch comments:", error);

          }
        }
      }
    };

    if (postSingle) fetchComments();
  }, [postSingle, getComment , sendNewComment]);

  const handleDelete = async () => {
    try {
      await deletePost({id : postSingle._id}).unwrap();
      // Optionally, navigate back to the post list or show a confirmation message
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };
  const handleSave = async () => {
    try {
      await savePost({id : postSingle._id}).unwrap();
      // Optionally, navigate back to the post list or show a confirmation message
      
      if(postSave?.find(val => val._id === postSingle._id)){
        //already have one
        setPostSave(postSave.filter(val => val._id !== postSingle._id));
      } else {
        setPostSave([...postSave , postSingle])
      }
      
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };


  const handleLike = async (like) => {
    try {
      await setLikeApi({ id: {[postSingle._id] : like} }).unwrap();
    } catch (error) {
      console.error("Failed to update like:", error);
    }
  };

  const sentNewComment = async () => {

    if(!newComment) return;

    const formData = new FormData;
    formData.append("content" , newComment);
    formData.append("id" , id);
    newImage.forEach(element => {
        formData.append(element)
    });
    try {
      SetSendNewcommnet(true)
      await setFetchComment({formData}).unwrap();

      setNewComment('');
      setnewImage([]);
      
    } catch (err) {
      console.log(err + " : sendNewComment")
    }
  };


  let lContent =  comments?.length / 24;
  let content
  const imagePath = postSingle?.images.map(image => `${process.env.REACT_APP_API}/${image.replace(/\\/g, '/')}`);

  if (isLoading) {
    content = <p>Loading post...</p>;
  } else if (isError || !postSingle) {
    content = <p>Error loading post. Please try again.</p>;
  } else {

    content = (
      <div className='page'>
        <Header/>
        <div className='post-single-content'>
          <h1>{postSingle.title}</h1>
          <p style={{margin : '2%'}}>{postSingle.content}</p>
          {imagePath.map(val => <img className='post-single-img'src={val} alt='pic'/>)}

          {/*link*/}
          {postSingle.food || postSingle.how || postSingle.loca ? <PostSingleLink i={postSingle}/> : null}

          <h1>{likeList.length - unLikeList.length}</h1>
          <div className='post-single-like-comp'>
          <button 
                                onClickCapture={() => 
                                    {
                                        if(likeList.find(val => val === username) ){ 
                                            {/*back to ori as already have like*/}
                                            handleLike(true);
                                           
                                            setLikeList(likeList.filter(val => val !== username))
                                        
                            
                                          } else {
                                            {/*set like*/}
                                            {/* api*/}
                                            handleLike(true);
                                           
                                            setLikeList([...likeList , username])
                                            setUnLikeList(unLikeList.filter(val => val !== username))
                    
                                          }
                                    }
                                    } 
                                className='post-single-like-comp-child'
                                style={{backgroundColor : ((likeList.find(val => val === username)) ? '#FFC0CB' : 'white') , border : 'black solid 1px' }}
                                >like</button>
                            <button 
                                onClickCapture={() => {
                                    if(unLikeList.find(val => val === username)){
                                        {/*set un unlike*/} 
                                        {/* api*/}
                                        handleLike(false);
                                
                                        setUnLikeList(unLikeList.filter(val => val !== username))
                                     
                        
                                      } else {
                                        {/* api*/}
                                        handleLike(false);
                
                                        setUnLikeList([...unLikeList , username])
                                        setLikeList(likeList.filter(val => val !== username))
                                      }
                                }} 
                                className='post-single-like-comp-child'style={{backgroundColor : ((unLikeList.find(val => val === username)) ? '#FFC0CB' : 'white') , border : 'black solid 1px' }}
                                >unlike</button>
            <button 
            className= 'post-single-like-comp-child'
            style={{backgroundColor : (postSave?.find(val => val._id === postSingle._id)) ? '#FFC0CB' : 'white' , border : 'black solid 1px' }} 
            onClick={handleSave}>Save </button>
          </div>
          <div className='post-single-link'>
            {comments && comments.length > 0 ? (
              comments.slice(24 * page, 24 * (page + 1)).map(comment => { 
                
                return (
                <PostsExcerpt key={comment._id} i={comment} />
              )})
            ) : (
              <p>No comment</p>
            )}
            <div className="page-control" style={{opacity : (!comments ? 1 : 0)}}>
                <button onClick={() => setPage(page - 1)}  disabled={page === 0} >
                   {"<"}
                </button>
                <button onClick={() => setPage(page + 1)} disabled={page + 1> lContent }>
                    {">"}
                </button>
            </div>
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder='.... new comment here'
            ></input>
            <button onClick={sentNewComment} > save</button>
          </div>
          <div className='content'>
            <button onClick={handleDelete}>Delete Post</button>
            
          </div>
        </div>
      </div>
    );
  }

  return content;
};

export default PostSingle;
