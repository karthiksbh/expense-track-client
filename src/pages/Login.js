import React, { useState } from 'react'

export const Login = () => {

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    async function loginUser(e){
        e.preventDefault();

        const response = await fetch('http://127.0.0.1:8000/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        const data=await response.json();
       if(response.status===200){
        localStorage.setItem('access_token',data.access_token);
        localStorage.setItem('refresh_token',data.refresh_token);
        alert("Login Success");
       }else{
        alert("Please check the email and password entered");
       }
    }

    return (
        <div className="container">
            <h2>Student Expense Tracker</h2>
            <div>
                <h4>Login</h4>
            </div>
            <>
                <h3>Login to View the Income and Expenses</h3>
                <form id="form" onSubmit={loginUser}>
                    <div className="form-control">
                        <label htmlFor="text">Email</label>
                        <input type="text" id="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email..." />
                    </div>
                    <div className="form-control">
                        <label
                        >Password<br /></label>
                        <input type="password" id="amount" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password..." />
                    </div>
                    <button className="btn">LOGIN USER</button>
                </form>
            </>
        </div>
    )
}
