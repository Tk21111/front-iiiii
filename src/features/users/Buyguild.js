import { useEffect, useState } from "react";
import { useGetAllNoteUserMutation } from "./NoteApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";
import BuyExcerpt from "./BuyExcerpt";
import filterEntitiesByTag from "./Search";

import { Link } from "react-router-dom";

const Buyrecommend = () => {
    const user = { username: useSelector(selectCurrentUser) };
    const [getAllNoteUser , { data: users, isLoading, isSuccess, isError, error }] = useGetAllNoteUserMutation();
    const [hasFetched, setHasFetched] = useState(false);

    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("text");

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!hasFetched) {
                    await getAllNoteUser(user);
                    setHasFetched(true);
                    console.log('f')
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [ hasFetched]);

    let content;

    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isSuccess) {
        //this is what u have to modifine
        //user = { ids , entities}
        //content is list because str didn't work
        content = []
        let tag = ['asd','asf','asaad'];
        let tagEn = {};

        //get taggg
        for (let f of tag){ 
            tagEn[f] = filterEntitiesByTag(users.entities, f, 'tag');
        }


        for (let i of Object.keys(tagEn)){
            content.push(<BuyExcerpt key={i} i={tagEn[i]} />);
        }

        console.log(content)
        
    } else if (isError) {
        let msg;
        if (error.status === 403) {
            msg = "Access denied. Go get a random number first.";
        } else {
            msg = JSON.stringify(error);
        }
        content = (
            <section>
                <h1>{msg}</h1>
                <Link to="/welcome">Back to Welcome</Link>
            </section>
        );
    }

    return (
        <div>
            <p>
                <Link to="/welcome"> Home </Link>
            </p>
            <Link to={`note/create`}> Create </Link>
            <div>
                <label>
                    Search Query:
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </label>
                <label>
                    Search Type:
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="text">Text</option>
                        <option value="tag">Tag</option>
                    </select>
                </label>
            </div>
            {content}
        </div>
    );
};

export default Buyrecommend;
