import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {v4 as uuidv4} from 'uuid';

import {client, urlFor} from "../../client";
import {pinDetailMorePinQuery, pinDetailQuery} from "../../utils/data";
import Spinner from "../Spinner";
import MasonryLayout from "../MasonryLayout";

import './PinDetail.scss';

const PinDetail = ({user}) => {
    const [pins, setPins] = useState(null);
    const [pinDetail, setPinDetail] = useState(null);
    const [comment, setComment] = useState('');
    const [addingComment, setAddingComment] = useState(false);
    const {pinId} = useParams();

    const addComment = () => {
        if (comment) {
            setAddingComment(true);

            client
                .patch(pinId)
                .setIfMissing({comments: []})
                .insert('after', 'comments[-1]', [{
                    comment,
                    _key: uuidv4(),
                    postedBy: {_type: 'postedBy', _ref: user._id}
                }])
                .commit()
                .then(() => {
                    fetchPinDetail();
                    setComment('');
                    setAddingComment(false);
                });
        }
    };


    const fetchPinDetail = () => {
        let query = pinDetailQuery(pinId);

        if (query) {
            client.fetch(`${query}`)
                .then(data => {
                    setPinDetail(data[0]);

                    if (data[0]) {
                        query = pinDetailMorePinQuery(data[0]);

                        client.fetch(query)
                            .then(res => setPins(res));
                    }
                })
        }
    }

    useEffect(() => {
        fetchPinDetail();
    }, [pinId]);

    if (!pinDetail) return <Spinner message="Loading pins..."/>

    return (
        <>
            <div className='pin__detail'>
                <div className='pin__detail-content'>
                    <div style={{width: '500px'}}>
                        <img
                            src={pinDetail?.image && urlFor(pinDetail.image).url()}
                            alt="user-post"
                            className='pin__detail-image'
                        />
                    </div>

                    <div className='pin__detail-content--right'>
                        <a className='pin__detail-destination' href={pinDetail.destination} target='black' rel='noreferrer'>
                            <div className='pin__detail-destination-link'>
                                <div className='pin__detail-destination-icon'/>
                                {pinDetail.destination}
                            </div>
                            <div className='pin__detail-destination-underline'/>
                        </a>

                        <div className='pin__detail-btns'>
                            <button className='pin__detail-btn save'>
                                Save to collection
                                <div className='pin__detail-btn-icon save'/>
                            </button>

                            <a
                                href={`${pinDetail?.image?.asset?.url}?dl=`}
                                download
                                onClick={(e) => e.stopPropagation()}
                                className='pin__detail-btn download'
                            >
                                Download
                                <div className='pin__detail-btn-icon download'/>
                            </a>
                        </div>

                        <h1>{pinDetail.title}</h1>
                        <p>{pinDetail.about}</p>

                        <Link to={`/user-profile/${pinDetail.postedBy?._id}`}
                              className='pin__detail-user'>
                            <div className='pin__detail-user-img'
                                 style={{backgroundImage: "url(" + pinDetail.postedBy?.image + ")"}}/>
                            <p className='font-bold'>{pinDetail.postedBy?.userName}</p>
                        </Link>

                        <div className='pin__detail-comment-title'>
                            <p className='font-bold'>Comments</p>
                            <div className='pin__detail-comment-separator'/>
                        </div>

                        {pinDetail?.comments?.map((comment, index) => (
                            <div className='pin__detail-comment' key={index}>
                                <div className='pin__detail-user-img'
                                     style={{backgroundImage: "url(" + comment.postedBy.image + ")"}}/>
                                <div className='pin__detail-comment-text'>
                                    <p className='font-bold'>{comment.postedBy.userName}</p>
                                    <p>{comment.comment}</p>
                                </div>
                            </div>
                        ))}

                        <div className='pin__detail-comment-field'>
                            <Link to={`user-profile/${pinDetail.postedBy?._id}`}>
                                <div className='pin__detail-user-img'
                                     style={{backgroundImage: "url(" + pinDetail.postedBy?.image + ")"}}/>
                            </Link>

                            <input
                                className='pin__detail-comment-input'
                                type="text"
                                placeholder='Add a comment...'
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <button
                                type='button'
                                className='pin__detail-comment-btn'
                                onClick={addComment}
                            >
                                {addingComment ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='pin__detail-recommendation-title'>
                <div className='pin__detail-recommendation-text'>More like this</div>
                <div className='pin__detail-recommendation-separator'/>
            </div>

            {pins?.length > 0 ? (
                <>
                    <MasonryLayout pins={pins}/>
                </>
            ) : (
                <Spinner message='Loading more pins...'/>
            )}
        </>

    )
}

export default PinDetail;