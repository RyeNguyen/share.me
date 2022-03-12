import React, {useState} from 'react';
import {Route, Routes} from 'react-router-dom';

import {CreatePin, Feed, Navbar, PinDetail, Search} from "../../components";

import './Pins.scss';

const Pins = ({user}) => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className='pins'>
            <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user}/>

            <div className='pins__content'>
                <Routes>
                    <Route path='/' element={<Feed/>}/>
                    <Route path='/category/:categoryId' element={<Feed/>}/>
                    <Route path='/pin-detail/:pinId' element={<PinDetail user={user}/>}/>
                    <Route path='/create-pin' element={<CreatePin user={user}/>}/>
                    <Route path='/search' element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>}/>
                </Routes>
            </div>
        </div>
    )
}

export default Pins;