import React from 'react'
import Message from './Message';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const RequestPage = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [colour, setColour] = useState('');
    const [amount, setAmount] = useState('');

    const [deleteMessage, setdeleteMessage] = useState('');
    const [deleteColour, setdeleteColour] = useState('');

    const [myRequests, setRequests] = useState([]);

    const fetchMyRequests = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = "/login";
                return;
            }
            const response = await fetch(process.env.REACT_APP_BASE_URL + '/request/my-requests', {
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

    async function addPaymentRequest(e) {
        e.preventDefault();
        const amountValue = parseFloat(amount);
        const token = localStorage.getItem('access_token');
        if (!token) {
            window.location.href = "/login";
            return;
        }

        const response = await fetch(process.env.REACT_APP_BASE_URL + '/request/pay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: title,
                amount: amountValue,
                email: email,
            })
        })

        const data = await response.json();
        console.log(data);
        if (response.ok) {
            setMessage("✔ Payment Request Sent");
            setColour("#90EE90");
            fetchMyRequests();
            setAmount('');
            setTitle('');
            setEmail('');
            setTimeout(() => {
                setMessage('');
                setColour('');
            }, 3000);
        } else {
            setMessage("✘ Invalid Details entered. Make sure the email of the user is not same as the logged in user");
            setColour("#FF6961");
            setTimeout(() => {
                setMessage('');
                setColour('');
            }, 3000);
        }
    }

    const deleteItem = async (transId) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = "/login";
                return;
            }
            const response = await fetch(process.env.REACT_APP_BASE_URL + `/request/status-delete/${transId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setdeleteMessage("✔ Payment Request Deleted");
                setdeleteColour("#90EE90");
                fetchMyRequests();
                setTimeout(() => {
                    setdeleteMessage('');
                    setdeleteColour('');
                }, 3000);
            } else {
                setdeleteMessage("✘ Failed to delete Payment Request");
                setdeleteColour("#FF6961");
                setTimeout(() => {
                    setdeleteMessage('');
                    setdeleteColour('');
                }, 3000);
            }
        } catch (error) {
            setdeleteMessage("✘ Failed to delete transaction");
            setdeleteColour("#FF6961");
            setTimeout(() => {
                setdeleteMessage('');
                setdeleteColour('');
            }, 3000);
        }
    }

    const editItem = async (transId) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = "/login";
                return;
            }
            const response = await fetch(process.env.REACT_APP_BASE_URL + `/request/status-change/${transId}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setdeleteMessage("✔ Payment Request Status Changed");
                setdeleteColour("#90EE90");
                fetchMyRequests();
                setTimeout(() => {
                    setdeleteMessage('');
                    setdeleteColour('');
                }, 3000);
            } else {
                setdeleteMessage("✘ Failed to change Status");
                setdeleteColour("#FF6961");
                setTimeout(() => {
                    setdeleteMessage('');
                    setdeleteColour('');
                }, 3000);
            }
        } catch (error) {
            setdeleteMessage("✘ Failed to change Status");
            setdeleteColour("#FF6961");
            setTimeout(() => {
                setdeleteMessage('');
                setdeleteColour('');
            }, 3000);
        }
    }

    const remindMail = async (transId) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = "/login";
                return;
            }
            const response = await fetch(process.env.REACT_APP_BASE_URL + `/request/send-mail/${transId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setdeleteMessage("✔ Payment Request Remainder Mail Sent");
                setdeleteColour("#90EE90");
                fetchMyRequests();
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
        fetchMyRequests();
    }, []);


    return (
        <div className="container">
            <Link to="/"> ← Go Back</Link>
            <>
                <h3>View My Requests</h3>
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
                                <button className="delete-btn" onClick={() => deleteItem(request._id)}>x</button>
                                <div className="action-buttons">
                                    <button className="action-btn edit-btn" onClick={() => editItem(request._id)}>🖊</button>
                                    {!request.payStatus && (
                                        <button className="action-btn remind-btn" onClick={() => remindMail(request._id)}>✉️</button>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

            </>

            <>
                <h3>Add New Payment Request</h3>
                {message && <Message message={message} colour={colour} />}
                <form id="form" onSubmit={addPaymentRequest}>
                    <div className="form-control">
                        <label htmlFor="text">Message for the Payment Request</label>
                        <input type="text" id="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter message..." />
                    </div>
                    <div className="form-control">
                        <label htmlFor="text">Email of the User to Send the Request</label>
                        <input type="email" id="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email..." />
                    </div>
                    <div className="form-control">
                        <label htmlFor="amount">Enter the Amount to Request</label>
                        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount..." />
                    </div>
                    <button className="btn">Send Payment Request</button>
                </form>
            </>
        </div>
    )
}
