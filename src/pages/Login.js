import React, { useState } from 'react'
import Message from './Message';

export const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [colour,setColour] = useState('');

    async function loginUser(e) {
        e.preventDefault();
        
        const response = await fetch(process.env.REACT_APP_BASE_URL + '/users/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })


        const data = await response.json();
        if (response.status === 200) {
            localStorage.setItem('access_token', data.access_token);
            setMessage("✔ Login Success");
            setColour("#90EE90");
            setTimeout(() => {
                window.location.href="/";
            }, 1000);
        } else {
            setMessage("✘ Login Failed: Please check your email ID and Password");
            setColour("#FF6961");
        }
    }

    const register = () => {
        window.location.href="/register";
      };

    return (
        <div className="container">
            <h2>Student Expense Tracker</h2>
            <div>
                <h4>Login</h4>
            </div>
            {message && <Message message={message} colour={colour}/>}
            <>
                <h3>Login to View the Income and Expenses</h3>
                <form id="form" onSubmit={loginUser}>
                    <div className="form-control">
                        <label htmlFor="text">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email..." />
                    </div>
                    <div className="form-control">
                        <label
                        >Password<br /></label>
                        <input type="password" id="amount" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password..." />
                    </div>
                    <button className="btn">LOGIN USER</button>
                    <button className="btn" style={{backgroundColor:"#FF6961"}} onClick={register}>DON'T HAVE AN ACCOUNT?</button>
                </form>
            </>
        </div>
    )
}
