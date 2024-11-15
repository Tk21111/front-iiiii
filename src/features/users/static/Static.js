import { useEffect, useState } from "react";
import { useGetAllNoteUserMutation } from "./../NoteApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../auth/authSlice";
import { Link } from "react-router-dom";
import Header from "../../../components/Header";
import BuyExcerptFood from "./BuyExcerptFood";
import BuyExcerpt from "./BuyExcerpt";
import filterEntitiesByTag from "../comp/Search";

const Static = () => {
    const currentUser = useSelector(selectCurrentUser);
    const [getAllNoteUser, { data: users, isLoading, isSuccess, isError, error }] = useGetAllNoteUserMutation();
    const [hasFetched, setHasFetched] = useState(false);
    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("text");
    const [searchTypeEnable, setSearchTypeEnable] = useState(true);
    const [renderType, setRenderType] = useState("tag");
    const [page ,setPage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!hasFetched) {
                try {
                    await getAllNoteUser({ username: currentUser });
                    setHasFetched(true);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchData();
    }, [getAllNoteUser, currentUser, hasFetched]);

    useEffect(() => {
        setSearchTypeEnable(renderType !== 'food');
    }, [renderType]);

    const renderContent = () => {
        if (isLoading) return <p>Loading...</p>;

        if (isError) {
            const errorMsg = error.status === 403
                ? "Access denied. Go get a random number first."
                : JSON.stringify(error);
            return (
                <section>
                    <h1>{errorMsg}</h1>
                    <Link to="/welcome">Back to Welcome</Link>
                </section>
            );
        }

        if (isSuccess) {
            if (renderType === 'food') {
                return users?.ids.map((id) => (
                    <BuyExcerptFood key={id} i={users.entities[id]} />
                )).slice(page*24,(page+1)*24);
            }

            if (renderType === 'tag') {
                const filteredEntities = search
                    ? filterEntitiesByTag(users.entities, search, searchType, false)
                    : users.entities;

                const tagEn = {};
                for (let key in filteredEntities) {
                    const tag = filteredEntities[key].tag;
                    tagEn[tag] = filterEntitiesByTag(filteredEntities, tag, 'tag', true);
                    tagEn[tag]['tag'] = tag;
                }

                return Object.keys(tagEn).map((tag) => (
                    <BuyExcerpt key={tag} i={tagEn[tag]} />
                )).slice(page*24,(page+1)*24);
            }
        }
        return null;
    };

    //pretent u don't see this
    let lContent = renderContent();
    lContent = lContent?.length / 24

    return (
        <div className="page">
            <Header />
            <div className='content'>
                <img src={require('../../../components/img/star.png')} alt="star" className="smalllogo" />
                <p style={{ marginRight: 'auto' }} className='welcomefont'>
                    <Link to="/static">Statistics</Link>
                </p>
            </div>
            {/* Search Component */}
            <div className="search">
                <img src={require('../../../components/img/search.png')} alt="icon" style={{ marginLeft: '8px' }} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                />
            </div>
            <div>
                <select
                    className="selection"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    disabled={!searchTypeEnable}
                >
                    <option value="text">Text</option>
                    <option value="tag">Tag</option>
                </select>
            </div>
            {/* End Search Component */}
            <div className="content">
                <h2 style={{ textAlign: 'center' }}>Use Food or Tag</h2>
                <select
                    className="selection"
                    value={renderType}
                    onChange={(e) => setRenderType(e.target.value)}
                >
                    <option value="tag">Tag</option>
                    <option value="food">Food</option>:
                </select>
            </div>
            {renderContent()}
            <div className="page-control">
                <button onClick={() => setPage(page - 1)}  disabled={page === 0} >
                   {"<"}
                </button>
                <button onClick={() => setPage(page + 1)} disabled={(page + 1) > lContent }>
                    {">"}

                </button></div>
            </div>
    );
};

export default Static;
