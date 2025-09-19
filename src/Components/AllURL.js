import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setVisitHistory } from '../features/User/UserSlice';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import '../App.css'
const AllURL = () => {
    const userId = useSelector((state) => state.user.userId);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [getUrls, setgetUrls] = useState(null);;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
 
    useEffect(() => {
        const getAllUrls = async () => {
            if (!userId) {
                setError('Please create an Account first');
                return;
            }

            setLoading(true);
            setError('');

            try {
                const response = await axios.get(`${BASE_URL}/api/url/admin/all/${userId}`);
                setgetUrls(response.data);
            } catch (error) {
                setError(error.response?.data?.error || 'Error fetching analytics');
            } finally {
                setLoading(false);
            }
        };
        getAllUrls()
    }, [userId,BASE_URL]);

    const handledeleteUrl = async (shortid) => {
        if (userId) {
            try {
                 await axios.delete(`${BASE_URL}/api/url/deleteUrl/${shortid}`, {
                    data: { userId }, // ✅ Pass userId in `data` for DELETE body
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                toast('Item deleted successfully!');
                navigate('/');
                // Update your frontend state here (e.g., remove the item from the list)
            } catch (error) {
                const errorMsg = error.response?.data?.error || error.message;
                setError(`Error deleting item: ${errorMsg}`);
            }
        }
    };

    const handlegetVisitHistory = async (visitHistory) => {
        dispatch(setVisitHistory({ visitHistory}))
        navigate('/VisitHistory')
    }

    return (
        <div>
            {(userId) && (
                <section className="analytics-section">
                    <ToastContainer />
                    <h2>Get All URLs Dashboard</h2>

                    <div id='getAllUrl'>
                        {getUrls && getUrls.map((myURL, index) => {

                            return (
                                <div className="analytics-box" key={index}>
                                    <h3>Analytics for {myURL.shortId}</h3>
                                    <p>
                                        <strong>Original URL:</strong> {myURL.originalUrl}
                                    </p>
                                    <p>
                                        <strong>Short URL:</strong> <a href={myURL.shortUrl} className='short-url'> {myURL.shortUrl}</a>
                                    </p>
                                    <p>
                                        <strong>Total Clicks:</strong> {myURL.totalClicks}
                                    </p>
                                    <p>
                                        <strong>Created At:</strong> {new Date(myURL.createdAt).toLocaleString()}
                                    </p>
                                    {myURL.visitHistory && myURL.visitHistory.length > 0 && (
                                        <div>
                                            <h4>Recent Clicks:</h4>
                                            <ul style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                {myURL.visitHistory.slice(-5).map((visit, idx) => (
                                                    <li key={idx}>
                                                        {new Date(visit.timestamp).toLocaleString()}
                                                    </li>
                                                ))}
                                                <button onClick={() => handlegetVisitHistory(myURL.visitHistory)} disabled={loading} className='btn btn-primary'>
                                                    {/* Get All User History */}
                                                    {loading ? 'Geting...' : 'Get User History'}
                                                </button>
                                            </ul>
                                        </div>
                                    )}
                                    <button onClick={() => handledeleteUrl(myURL.shortId)} disabled={loading} className='btn btn-primary'>
                                        {loading ? 'Deleting...' : 'Delete Short URL'}
                                    </button>
                                    {error && (!index) && <p className="error">{error}</p>}
                                </div>
                            );
                        })}

                    </div>
                </section>
            )}
        </div>
    )
}

export default AllURL
