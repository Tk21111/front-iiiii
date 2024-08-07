import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCreatelocaMutation } from './LocaApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';
import { Link } from 'react-router-dom';

const CreatePost = () => {
    const navigate = useNavigate()
    const { noteId } = useParams();
    
    const username = useSelector(selectCurrentUser);

    const [createLoca, { isLoading }] = useCreatelocaMutation()
    const [town, setTown] = useState('')
    const [subdistrict, setSubdistrict] = useState('')
    const [county, setCounty] = useState('')
    const [more, setMore] = useState('')
    const [image, setImage] = useState(null)

    if (isLoading) return <p>Loading...</p>

    const onTownChange = e => setTown(e.target.value)
    const onSubdistrictChange = e => setSubdistrict(e.target.value)
    const onCountyChange = e => setCounty(e.target.value)
    const onMoreChange = e => setMore(e.target.value)
    const onImageChange = e => setImage(e.target.files[0])

    const canSave = [town, subdistrict, county, noteId].every(Boolean)

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                const formData = new FormData();

                formData.append("food", noteId)
                formData.append("username", username)
                formData.append("town", town)
                formData.append("subdistrict", subdistrict)
                formData.append("county", county)
                formData.append("more", more)
                if (image) {
                    formData.append("image", image)
                }

                console.log(formData)

                await createLoca({formData}).unwrap();
                setTown('');
                setSubdistrict('');
                setCounty('');
                setMore('');
                setImage(null);
                navigate(`/location`)
            } catch (err) {
                console.error('Failed to save the post', err)
            }
        }
    }

    return (
        <section>
            <p><Link to="/user">Food List</Link></p>
            <p><Link to="/welcome">Home</Link></p>
            <h2>Create Post</h2>
            <form>
                <label htmlFor="locaTown">Town:</label>
                <input
                    type="text"
                    id="locaTown"
                    name="locaTown"
                    value={town}
                    onChange={onTownChange}
                />
                <label htmlFor="locaSubdistrict">Subdistrict:</label>
                <input
                    type="text"
                    id="locasubdistrict"
                    name="locasubdistrict"
                    value={subdistrict}
                    onChange={onSubdistrictChange}
                />
                <label htmlFor="locaCountry">County:</label>
                <input
                    type="text"
                    id="locacountry"
                    name="locacountry"
                    value={county}
                    onChange={onCountyChange}
                />
                <label htmlFor="locaMore">More info:</label>
                <input
                    type="text"
                    id="locamore"
                    name="locamore"
                    value={more}
                    onChange={onMoreChange}
                />
                <label htmlFor="locaImage">Upload Image:</label>
                <input
                    type="file"
                    id="locaImage"
                    name="locaImage"
                    onChange={onImageChange}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >
                    Save Post
                </button>
            </form>
        </section>
    )
}

export default CreatePost
