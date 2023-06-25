import React from 'react'
import { useState,useEffect } from 'react';
import Message from './Message';
import { Link } from 'react-router-dom';

export const ReceiveRequests = () => {

    const [myRequests, setRequests] = useState([]);
    const [deleteMessage,setdeleteMessage] = useState('');
    const [deleteColour,setdeleteColour] = useState('');

    const fetchReceivedRequests = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = "/login";
                return;
            }
            const response = await fetch(process.env.REACT_APP_BASE_URL + '/request/view-requests', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setRequests(data.requests);
        } catch (error) {
            console.error('Error fetching expense:', error);
        }
    }

    const paidMail = async (transId) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = "/login";
                return;
            }
            const response = await fetch(process.env.REACT_APP_BASE_URL + `/request/paid-mail/${transId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setdeleteMessage("✔ Payment Done Mail Sent");
                setdeleteColour("#90EE90");
                fetchReceivedRequests();
                setTimeout(() => {
                    setdeleteMessage('');
                    setdeleteColour('');
                }, 3000);
            } else {
                setdeleteMessage("✘ Failed to change the Mail. Please try again.");
                setdeleteColour("#FF6961");
                setTimeout(() => {
                    setdeleteMessage('');
                    setdeleteColour('');
                }, 3000);
            }
        } catch (error) {
            setdeleteMessage("✘ Failed to change the Mail. Please try again.");
            setdeleteColour("#FF6961");
            setTimeout(() => {
                setdeleteMessage('');
                setdeleteColour('');
            }, 3000);
        }
    }

    useEffect(() => {
        fetchReceivedRequests();
    }, []);

    return (
        <div className="container">
            <Link to="/"> ← Go Back</Link>
            <>
                <h3>View Received Requests</h3>
                {deleteMessage && <Message message={deleteMessage} colour={deleteColour} />}
                <ul id="list" className="list">
                    {myRequests.map((request) => (
                        <li key={request._id} className={request.payStatus === true ? 'money plus' : 'money minus'}>
                            <div className="request-info">
                                <div className="request-title">{request.title}</div>
                                <div className="request-date">{new Date(request.createdOn).toLocaleDateString('en-GB')}</div>
                                <div className="request-amount">₹{request.amount}</div>
                                <div className="request-user">Request Sent to: {request.payUser.email}</div>
                                <div className="request-user">Payment Request Status: {request.payStatus ? 'Paid' : 'Not Paid'}</div>
                            </div>
                            <div className="request-actions">
                                <div className="action-buttons">
                                {!request.payStatus && (
                                        <button className="action-btn remind-btn" onClick={() => paidMail(request._id)}>✉️</button>
                                )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

            </>
        </div>
    )
}
