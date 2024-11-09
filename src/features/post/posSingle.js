import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  useGetPostQuery, 
  useSetLikeMutation, 
  useCreateCommentMutation, 
  useGetCommentMutation 
} from './PostApiSlice';
import PostsExcerpt from './postExcerpt';
import Header from '../../components/Header';


const PostSingle = () => {
  const { id } = useParams();
  const { data: postsData, isLoading, isError } = useGetPostQuery();
  const [setFetchLike] = useSetLikeMutation();
  const [setFetchComment, {data : setComment}] = useCreateCommentMutation();
  const [getComment, { data: commentsData }] = useGetCommentMutation();

  const [postSingle, setPostSingle] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [likeWhat , setLikeWhat] = useState(0)
  const [comments, setComments] = useState([]);
  const [newComment , setNewComment] = useState('');
  const [newImage , setnewImage] = useState([]);

  useEffect(() => {
    if (postsData && id) {
      const post = postsData.entities[id] // Adjust for object or array

      if (post) {
        setPostSingle(post);
        setLikeCount((post?.like?.length || 0 )- (post?.unlike?.length || 0));
      } else {
        console.error("Post not found in data");
      }
    }
  }, [postsData, id , isLoading]);

  //get comment
  useEffect(() => {
    const fetchComments = async () => {
      if (postSingle?._id) {
        try {
          const fetchedComments = await getComment({ id: postSingle._id }).unwrap();
          setComments(fetchedComments || []);
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
  }, [postSingle, getComment]);

  const handleLike = async (like) => {
    try {
      await setFetchLike({ id: {[postSingle._id] : like} }).unwrap();
      setLikeCount(prev => prev + (like ? 1 : -1));
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

      console.log(formData.get('id'))
      await setFetchComment({formData}).unwrap();

      setNewComment('');
      setnewImage([]);
    } catch (err) {
      console.log(err + " : sendNewComment")
    }
  };

  let content;
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
          <h1>{postSingle.content}</h1>
          {imagePath.map(val => <img className='post-single-img'src={val} alt='pic'/>)}
          <div className='post-single-like-comp'>
            <button className= 'post-single-like-comp-child' onClick={() => {
              if(likeWhat === 1) return null;
              handleLike(true);
              setLikeCount(likeCount + 1)
              setLikeWhat(1)
            }}>Like</button>
            <p className= 'post-single-like-comp-child'>{likeCount}</p>
            <button className= 'post-single-like-comp-child'  onClick={() => {
              if(likeWhat === 2) return null;
              handleLike(false);
              setLikeCount(likeCount - 1);
              setLikeWhat(2)
            }}>Unlike</button>
          </div>
          <div className='post-single-comment-parent'>
            {comments && comments.length > 0 ? (
              comments.map(comment => (
                <PostsExcerpt key={comment._id} i={comment} />
              ))
            ) : (
              <p>No comment</p>
            )}
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder='.... new comment here'
            ></input>
            <button onClick={sentNewComment} > save</button>
          </div>
        </div>
      </div>
    );
  }

  return content;
};

export default PostSingle;
