import React, { useState } from 'react'
import Message from './Message';

export const Register = () => {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [message, setMessage] = useState(null);
    const [colour,setColour] = useState('');

    async function registerUser(e) {
        e.preventDefault();

        const response = await fetch(process.env.REACT_APP_BASE_URL + '/users/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName:fname,
                lastName:lname,
                email: email,
                password: password
            })
        })

        console.log(response);
        if(response.status===201){
            setMessage("✔ User successfully registered");
            setColour("#90EE90");
            setTimeout(() => {
                window.location.href="/login";
            }, 1500);
        }else{
            setMessage("✘ Please check if the details are correct and the email is not registered");
            setColour("#FF6961");
        }
    }

    const login = () => {
        window.location.href="/login";
      };


    return (
        <div className="container">
            <h2>Student Expense Tracker</h2>

            <div>
                <h4>Register a New User</h4>
            </div>
            {message && <Message message={message} colour={colour}/>}
            <>
                <h3>Register to Start using the Expense Tracker</h3>
                <form id="form" onSubmit={registerUser}>
                    <div className="form-control">
                        <label htmlFor="text">First Name *</label>
                        <input type="text" id="text" value={fname} onChange={(e) => setFname(e.target.value)} placeholder="Enter your first name..." />
                    </div>
                    <div className="form-control">
                        <label htmlFor="text">Last Name </label>
                        <input type="text" id="text" value={lname} onChange={(e) => setLname(e.target.value)} placeholder="Enter your last name..." />
                    </div>
                    <div className="form-control">
                        <label htmlFor="text">Email *</label>
                        <input type="email" id="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email..." />
                    </div>
                    <div className="form-control">
                        <label
                        >Password *<br /></label>
                        <input type="password" id="amount" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password..." />
                    </div>
                    <button className="btn">REGISTER USER</button>
                    <button className="btn" style={{backgroundColor:"#FF6961"}} onClick={login}>ALREADY HAVE AN ACCOUNT?</button>
                </form>
            </>
        </div>
    )
}
