import { useEffect, useState, useMemo } from 'react';
import { useGetAllnoteQuery, useGetHowQuery } from '../NoteApiSlice';
import { Link } from 'react-router-dom';
import Header from '../../../components/Header';
import Overay from '../../../components/Overlay';
import { listNew as menu } from '../comp/menu';

const RenderItem = ({ item, haveTags, notHaveTags }) => (
    <a
        className="food-waste-item"
        href={`/recommend/${item.id}!!${haveTags}`}
        style={{
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
        }}
    >
        <div className="food-waste-front">
            <img src="./home.png" alt="Icon" className="smalllogolist" />
        </div>
        <div className="food-waste-content" style={{ flex: 1, marginLeft: '10px' }}>
            <div className="food-waste-details" style={{ width: '100%' }}>
                <p>{item.name}</p>
                <ul>
                    {haveTags.map((tag, idx) => (
                        <li style={{ color: '#47BA01' }} key={idx}>
                            {tag}
                        </li>
                    ))}
                </ul>
                <ul>
                    {notHaveTags.map((tag, idx) => (
                        <li style={{ color: '#B1AFAF' }} key={idx}>
                            {tag}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </a>
);

const Recommend = () => {
    const { data: howData, isLoading: isHowLoading, isSuccess: isHowSuccess } = useGetHowQuery();
    const { data: noteData, isLoading: isNoteLoading, isSuccess: isNoteSuccess, isError, error } = useGetAllnoteQuery();

    const [listSorted, setListSorted] = useState([]);
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('name');
    const [page, setPage] = useState(0);

    // Process and filter data for recommendations
    //only recalculate when howData change
    const dataFiltered = useMemo(() => {
        if (!isHowSuccess || !howData) return null;
        return howData.map((obj) => [obj.tag, [{ name: obj.name, id: obj._id }]]);
    }, [howData, isHowSuccess]);

    useEffect(() => {
        if (isNoteSuccess && dataFiltered) {
            const { ids, entities } = noteData;
            let tagList = [];
            ids.forEach((id) => {
                const entity = entities[id];
                if (entity?.tag) {
                    const count = (entity.count || 0) - (entity.countExp || 0);
                    if (count > 0) {
                        tagList.push(...entity.tag);
                    }
                }
            });

            // Remove duplicates
            tagList = [...new Set(tagList)];

            // Merge menu and filtered data
            const combinedMenu = [...menu, ...dataFiltered];

            // Sort recommendations
            const sorted = combinedMenu.map((menuItem) => {
                const tags = menuItem[0];
                const hasTags = tags.filter((tag) => tagList.includes(tag));
                const notHasTags = tags.filter((tag) => !tagList.includes(tag));
                return [menuItem[1].map((item) => item.name), menuItem[1], hasTags, notHasTags, hasTags.length];
            });
            sorted.sort((a, b) => b[4] - a[4]);

            setListSorted(sorted);
        }
    }, [noteData, isNoteSuccess, dataFiltered]);

    const renderContent = () => {
        if (isHowLoading || isNoteLoading) return <p>Loading...</p>;
        if (isError) {
            const errorMsg = error.status === 403 ? 'Access denied. Please log in.' : JSON.stringify(error);
            return (
                <section>
                    <h1>{errorMsg}</h1>
                    <Link to="/welcome">Back to Welcome</Link>
                </section>
            );
        }

        if (listSorted.length > 0) {
            const paginatedContent = listSorted.slice(page * 24, (page + 1) * 24);
            return paginatedContent.map((item, index) => (
                <RenderItem
                    key={index}
                    item={item[1][0]} // Assumes only one item per menu category
                    haveTags={item[2]}
                    notHaveTags={item[3]}
                />
            ));
        }

        return <p>No matching results found.</p>;
    };

    return (
        <div className="page">
            <Header />
            <div className="content">
                <img src={require('../../../components/img/star.png')} alt="Star Icon" className="smalllogo" />
                <p style={{ marginRight: 'auto' }} className="welcomefont">
                    <Link to="/recommend">Menu Recommendation</Link>
                </p>
            </div>

            {/* Search Component */}
            <div className="search">
                <img src={require('../../../components/img/search.png')} alt="Search Icon" style={{ marginLeft: '8px' }} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                />
            </div>
            <select
                className="selection"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
            >
                <option value="name">Name</option>
                <option value="tag">Tag</option>
            </select>
            {/* End Search Component */}

            <Overay link="recommend/create" />
            <div className="user-list-parent">{renderContent()}</div>

            {/* Pagination */}
            <div className="page-control">
                <button onClick={() => setPage(page - 1)} disabled={page === 0}>
                    {"<"}
                </button>
                <button onClick={() => setPage(page + 1)} disabled={(page + 1) * 24 >= listSorted.length}>
                    {">"}
                </button>
            </div>
        </div>
    );
};

export default Recommend;
