import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  useGetPostQuery, 
  useSetLikeMutation, 
  useSetCommentMutation, 
  useGetCommentMutation 
} from './PostApiSlice';
import PostExcerpt from './postExcerpt';

const PostSingle = () => {
  const { id } = useParams();
  const { data: postsData, isLoading, isError } = useGetPostQuery();
  const [setFetchLike] = useSetLikeMutation();
  const [setFetchComment] = useSetCommentMutation();
  const [getComment, { data: commentsData }] = useGetCommentMutation();

  const [postSingle, setPostSingle] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (postsData && id) {
      const post = Array.isArray(postsData) ? postsData.find(post => post._id === id) : postsData[id]; // Adjust for object or array
      if (post) {
        setPostSingle(post);
        setLikeCount(post.like?.length - post.unlike?.length || 0);
      } else {
        console.error("Post not found in data");
      }
    }
  }, [postsData, id]);

  useEffect(() => {
    const fetchComments = async () => {
      if (postSingle?._id) {
        try {
          const fetchedComments = await getComment({ id: postSingle._id }).unwrap();
          setComments(fetchedComments || []);
        } catch (error) {
          console.error("Failed to fetch comments:", error);
        }
      }
    };

    if (postSingle) fetchComments();
  }, [postSingle, getComment]);

  const handleLike = async (like) => {
    try {
      await setFetchLike({ id: postSingle._id, like }).unwrap();
      setLikeCount(prev => prev + (like ? 1 : -1));
    } catch (error) {
      console.error("Failed to update like:", error);
    }
  };

  let content;

  if (isLoading) {
    content = <p>Loading post...</p>;
  } else if (isError || !postSingle) {
    content = <p>Error loading post. Please try again.</p>;
  } else {
    content = (
      <article>
        <h2>{postSingle.title}</h2>
        <p>{postSingle.content}</p>
        <div>
          <button onClick={() => handleLike(true)}>Like</button>
          <p>{likeCount}</p>
          <button onClick={() => handleLike(false)}>Unlike</button>
        </div>
        <div>
          {comments && comments.length > 0 ? (
            comments.map(comment => (
              <PostExcerpt key={comment.id} comment={comment} />
            ))
          ) : (
            <button onClick={() => setFetchComment({ id: postSingle._id }).unwrap()}>
              Fetch Comments
            </button>
          )}
        </div>
      </article>
    );
  }

  return <div>{content}</div>;
};

export default PostSingle;
