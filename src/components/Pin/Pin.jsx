import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';

import {client, urlFor} from "../../client";
import {fetchUser} from "../../utils/fetchUser";

import './Pin.scss';

const Pin = ({pin: {postedBy, image, _id, destination, save}}) => {
    const [postHovered, setPostHovered] = useState(false);
    const [savingPost, setSavingPost] = useState(false);

    const navigate = useNavigate();

    const user = fetchUser();

    const alreadySaved = !!(save?.filter(item => item?.postedBy?._id === user?.googleId))?.length;

    const savePin = (id) => {
        if (!alreadySaved) {
            setSavingPost(true);

            client
                .patch(id)
                .setIfMissing({save: []})
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: user?.googleId,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user?.googleId
                    },
                }])
                .commit()
                .then(() => {
                    window.location.reload();
                    setSavingPost(false);
                });
        }
    }

    const deletePin = (id) => {
        client
            .delete(id)
            .then(() => {
                window.location.reload();
            })
    }

    return (
        <div className='pin'>
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className='relative cursor-zoom-in w-auto overflow-hidden transition-all duration-500 ease-in-out'
            >
                <img className='rounded-lg w-full' src={urlFor(image).width(250).url()} alt="user-post"/>
                {postHovered && (
                    <div className='pin__overlay'>
                        <div className='flex items-center justify-end'>
                            {alreadySaved ? (
                                <button type='button' className='pin__btn'>
                                    {save?.length} Saved
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        savePin(_id);
                                    }}
                                    type='button'
                                    className='pin__btn'
                                >
                                    {savingPost ? 'Saving' : 'Save'}
                                </button>
                            )}
                        </div>

                        <div className='flex justify-between items-center w-full'>
                            {/*{destination && (*/}
                            {/*    <a*/}
                            {/*        href={destination}*/}
                            {/*        target='blank'*/}
                            {/*        rel='noreferrer'*/}
                            {/*        className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'*/}
                            {/*    >*/}
                            {/*        <BsFillArrowUpRightCircleFill/>*/}
                            {/*        {destination.length > 15 ? `${destination.slice(0, 15)}...` : destination}*/}
                            {/*    </a>*/}
                            {/*)}*/}

                            {postedBy?._id === user?.googleId && (
                                <button
                                    type='button'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deletePin(_id);
                                    }}
                                    className='button--icon pin__btn'
                                >
                                    <div className='pin__icon delete'/>
                                </button>
                            )}

                            <a
                                href={`${image?.asset?.url}?dl=`}
                                download
                                onClick={(e) => e.stopPropagation()}
                                className='button--icon pin__btn download'
                            >
                                <div className='pin__icon download'/>
                            </a>
                        </div>
                    </div>
                )}
            </div>

            <Link to={`user-profile/${postedBy?._id}`} className='pin__user'>
                <img className='pin__user-img' src={postedBy?.image} alt="user-profile"/>
                <p className='pin__user-name'>{postedBy?.userName}</p>
            </Link>
        </div>
    )
}

export default Pin;