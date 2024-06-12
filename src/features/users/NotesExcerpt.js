import { Link } from 'react-router-dom';
import { useGetAllnoteQuery } from "./NoteApiSlice";

const PostsExcerpt = ({ postId }) => {

    const { post } = useGetAllnoteQuery('getAllnote', {
        selectFromResult: ({ data }) => ({
            post: data?.entities[postId]
        }),
    })

    return (
        <article>
            <h2>{post.text}</h2>
            <p className="excerpt">{post.timeOut.substring(0, 75)}...</p>
            <p className="postCredit">
                <Link to={`post/${post.id}`}>View Post</Link>
            </p>
        </article>
    )
}

export default PostsExcerpt