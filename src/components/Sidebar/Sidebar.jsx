import React from 'react';
import {NavLink} from 'react-router-dom';
import {categories} from "../../utils/data";

import './Sidebar.scss';

const Sidebar = ({closeToggle}) => {
    const handleCloseSidebar = () => {
        if (closeToggle) closeToggle(false);
    }

    return (
        <div className='sidebar'>
            <NavLink
                to='/'
                onClick={handleCloseSidebar}
            >
                <div className='sidebar__logo'/>
            </NavLink>

            <NavLink
                to='/'
                className={({isActive}) => isActive ? 'sidebar__item--active' : 'sidebar__item'}
                onClick={handleCloseSidebar}
            >
                <div className='sidebar__icon sidebar__icon--home'/>
                Home
            </NavLink>

            <div className='sidebar__title'>Discover categories</div>

            <div className='sidebar__items'>
                {categories.slice(0, categories.length - 1).map(category => (
                    <NavLink
                        to={`/category/${category.name}`}
                        className={({isActive}) => isActive ? 'sidebar__item--active' : 'sidebar__item'}
                        onClick={handleCloseSidebar}
                        key={category.name}
                    >
                        <div className={ `sidebar__icon sidebar__icon--${category.name}` } />
                        <div className='sidebar__item-name'>{category.name}</div>
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default Sidebar;