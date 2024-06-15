import { useState } from 'react'
import { useNavigate , useParams } from 'react-router-dom'
import { useCreatelocaMutation } from './LocaApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';

const CreatePost = () => {
    const navigate = useNavigate()
    const { noteId } = useParams();
    
    const username = useSelector(selectCurrentUser);

    const [createLoca, { isLoading }] = useCreatelocaMutation()
    const [town, setTown] = useState('')
    const [subdistrict, setSubdistrict] = useState('')
    const [county, setCounty] = useState('')
    const [more, setMore] = useState('')
    

    if (isLoading) return <p>Loading...</p>

    const onTownChange = e => setTown(e.target.value)
    const onSubdistrictChange = e => setSubdistrict(e.target.value)
    const onCountryChange = e => setCounty(e.target.value)
    const onMoreChange = e => setMore(e.target.value)

    const canSave = [town, subdistrict, county , noteId].every(Boolean)

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                await createLoca({ food : noteId , username, town, subdistrict, county, more}).unwrap()
                setTown('');
                setSubdistrict('');
                setCounty('');
                setMore('');
                navigate(`/location`)
            } catch (err) {
                console.error('Failed to save the post', err)
            }
        }
    }

    return (
        <section>
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
                <label htmlFor="locaCountry">Country:</label>
                <input
                    type="text"
                    id="locacountry"
                    name="locacountry"
                    value={county}
                    onChange={onCountryChange}
                />
                <label htmlFor="locaMote">More info:</label>
                <input
                    type="text"
                    id="locamore"
                    name="locamore"
                    value={more}
                    onChange={onMoreChange}
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
