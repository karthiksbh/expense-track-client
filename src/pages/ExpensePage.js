import React, { useState, useEffect } from 'react'

export const ExpensePage = () => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState(0);
    const [balance, setBalance] = useState(0);
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');

    const [name, setName] = useState('');

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = "/login";
                return;
            }
            const response = await fetch('http://127.0.0.1:8000/profile/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 401) {
                window.location.href = "/login";
                return;
            }
            const data = await response.json();
            console.log(data.data.first_name);
            var fullName = "";
            if (data.data.last_name === null) {
                fullName = data.data.first_name;
            } else {
                fullName = data.data.first_name + " " + data.data.last_name;
            }
            console.log(fullName);
            setName(fullName);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const fetchTotals = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = "/login";
                return;
            }
            const response = await fetch('http://127.0.0.1:8000/totals/',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            const data = await response.json();
            console.log(data);
            setIncome(data.income);
            setExpense(data.expense);
        } catch (error) {
            console.error('Error fetching expense:', error);
        }
    };

    const fetchExpense = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = "/login";
                return;
            }
            const response = await fetch('http://127.0.0.1:8000/balance/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data);
            setBalance(data.total);
        } catch (error) {
            console.error('Error fetching expense:', error);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchTotals();
        fetchExpense();
    }, []);


    async function addTransaction(e) {
        e.preventDefault();
        const amountValue = parseFloat(amount);
        const token = localStorage.getItem('access_token');
        if (!token) {
            window.location.href = "/login";
            return;
        }

        const response = await fetch('http://127.0.0.1:8000/transaction/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: title,
                amount: amountValue,
                typeof: selectedOption,
            })
        })

        const data = await response.json();
        console.log(data);
        if (response.ok) {
            alert('Transaction Added');
            fetchExpense();
            fetchTotals();
            setAmount('');
            setTitle('');
            setSelectedOption('');
        } else {
            alert('Invalid Inputs');
        }
    }


    return (
        <div className="container">
            <h2>Hi {name},</h2>
            <div>
                <h4>Your Balance</h4>
                <h1>₹{balance}</h1>
            </div>

            <div className="inc-exp-container">
                <div>
                    <h4>Income</h4>
                    <p id="money-plus" className="money plus">+₹{income}</p>
                </div>
                <div>
                    <h4>Expense</h4>
                    <p id="money-minus" className="money minus">-₹{expense}</p>
                </div>
            </div>

            <>
                <h3>History</h3>
                <ul id="list" className="list">
                    <li className="minus">
                        Cash <span>-₹400</span><button className="delete-btn">x</button>
                    </li>
                </ul>
            </>

            <>
                <h3>Add new transaction</h3>
                <form id="form" onSubmit={addTransaction}>
                    <div className="form-control">
                        <label htmlFor="text">Text</label>
                        <input type="text" id="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter text..." />
                    </div>
                    <div className="form-control">
                        <label htmlFor="dropdown">Dropdown</label>
                        <select id="dropdown" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                            <option value="" disabled>Select an option</option>
                            <option value="Income">Income</option>
                            <option value="Expenditure">Expense</option>
                        </select>
                    </div>
                    <div className="form-control">
                        <label htmlFor="amount"
                        >Amount </label>
                        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount..." />
                    </div>
                    <button className="btn">Add transaction</button>
                </form>
            </>
        </div>
    )
}
