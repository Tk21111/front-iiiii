import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useGetAllnoteQuery } from "./NoteApiSlice";

const SinglePostPage = () => {
    const { postId } = useParams()

    const { post, isLoading } = useGetAllnoteQuery('getAllnote', {
        selectFromResult: ({ data, isLoading }) => ({
            post: data?.entities[postId],
            isLoading
        }),
    })

    if (isLoading) return <p>Loading...</p>

    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    return (
        <article>
            <h2>{post.text}</h2>
            <p>{post.timeOut}</p>
            <p className="postCredit">
                <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
            </p>
        </article>
    )
}

export default SinglePostPage