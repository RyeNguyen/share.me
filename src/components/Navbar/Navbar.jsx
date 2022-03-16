import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {IoMdAdd} from 'react-icons/io';

import './Navbar.scss';

const Navbar = ({searchTerm, setSearchTerm, user}) => {
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <div className='navbar'>
            <div className='navbar__search'>
                <div className='navbar__search-icon'/>
                <input
                    type="text"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    value={searchTerm}
                    onFocus={() => navigate('/search')}
                    className='navbar__search-input'
                />
            </div>

            <Link to={`user-profile/${user?._id}`} className='hidden md:block'>
                <div className='navbar__user' style={{backgroundImage: "url(" + user.image + ")"}}/>
            </Link>

            <Link to='create-pin' className='navbar__btn'>
                Post
            </Link>
        </div>
    )
}

export default Navbar;