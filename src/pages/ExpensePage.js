import React, { useState, useEffect } from 'react'
import Message from './Message';
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";

export const ExpensePage = () => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category,setCategory] = useState('');

    const [balance, setBalance] = useState(0);
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [warning,setWarning] = useState('');
    const [selectedOption, setSelectedOption] = useState('');

    const [transactions, setTransactions] = useState([]);

    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [colour, setColour] = useState('');

    const [deleteMessage, setdeleteMessage] = useState('');
    const [deleteColour, setdeleteColour] = useState('');

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = "/login";
                return;
            }
            const response = await fetch(process.env.REACT_APP_BASE_URL + 'profile/', {
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

    const labels = ["Income", "Expense"];

    const chartData = {
        labels: labels,
        datasets: [
            {
                data: [income, -expense],
                backgroundColor: ['#2E8B57', '#c0392b'],
                hoverBackgroundColor: ['#4CAF50', 'rgb(255, 105, 97)'],
            },
        ],
    };

    const fetchTotals = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = "/login";
                return;
            }
            const response = await fetch(process.env.REACT_APP_BASE_URL + 'totals/',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            const data = await response.json();
            console.log(data);
            setIncome(data.income);
            setExpense(data.expense);
            if(data.income<data.expense){
                setWarning('warn');
            }else{
                setWarning('');
            }
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
            const response = await fetch(process.env.REACT_APP_BASE_URL + 'balance/', {
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

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = "/login";
                return;
            }
            const response = await fetch(process.env.REACT_APP_BASE_URL + 'history/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching expense:', error);
        }
    }

    const deleteItem = async (transId) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = "/login";
                return;
            }
            const response = await fetch(process.env.REACT_APP_BASE_URL + `delete/${transId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setdeleteMessage("✔ Transaction Deleted");
                setdeleteColour("#90EE90");
                fetchExpense();
                fetchTotals();
                fetchTransactions();
                setTimeout(() => {
                    setdeleteMessage('');
                    setdeleteColour('');
                }, 3000);
            } else {
                setdeleteMessage("✘ Failed to delete transaction");
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

    useEffect(() => {
        fetchUser();
        fetchTotals();
        fetchExpense();
        fetchTransactions();
    }, []);


    async function addTransaction(e) {
        e.preventDefault();
        const amountValue = parseFloat(amount);
        const token = localStorage.getItem('access_token');
        if (!token) {
            window.location.href = "/login";
            return;
        }

        const response = await fetch(process.env.REACT_APP_BASE_URL + 'transaction/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: title,
                amount: amountValue,
                typeof: selectedOption,
                categories: category
            })
        })

        const data = await response.json();
        console.log(data);
        if (response.ok) {
            setMessage("✔ Transaction Added");
            setColour("#90EE90");
            fetchExpense();
            fetchTotals();
            fetchTransactions();
            setAmount('');
            setTitle('');
            setSelectedOption('');
            setTimeout(() => {
                setMessage('');
                setColour('');
            }, 3000);
        } else {
            setMessage("✘ Invalid Details entered");
            setColour("#FF6961");
            setTimeout(() => {
                setMessage('');
                setColour('');
            }, 3000);
        }
    }

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = "/login";
    };

    const IncomeDropdown = () => {
        return (
          <div>
            <label>Income Categories</label>
            <select id="dropdown" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="" disabled>Select an option</option>
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Investment">Investment</option>
              <option value="Rental Income">Rental Income</option>
              <option value="Gifts">Gifts</option>
              <option value="Other">Other</option>
            </select>
          </div>
        );
      };
      
      const ExpenditureDropdown = () => {
        return (
          <div>
            <label>Expenditure Categories</label>
            <select id="dropdown" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="" default disabled>Select an option</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Housing and Groceries">Housing and Groceries</option>
              <option value="Health">Health</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Personal Care">Personal Care</option>
              <option value="Other">Other</option>
            </select>
          </div>
        );
      };


    return (
        <div className="container">
            <h2>Welcome {name},</h2>
            <div>
                <h4>Your Balance</h4>
                <h1>₹{balance}</h1>
            </div>

            {warning==='warn' && <Message message="Warning: Expenses have exceeded the income. Please review and adjust your spending." colour="#FF6961" />}

            <div className="container">
                <h3 className="chart-title">Income Expenditure Chart</h3>
                <div className="chart-box">
                    <Pie data={chartData} />
                </div>
            </div>

            <>
                <h3>Transaction History</h3>
                {deleteMessage && <Message message={deleteMessage} colour={deleteColour} />}
                <ul id="list" className="list">
                    {transactions.map((transaction) => (
                        <li key={transaction.id} className={transaction.typeof === 'Income' ? 'money plus' : 'money minus'}>
                            {transaction.title} - {new Date(transaction.createdOn).toLocaleDateString('en-GB')} <span>{transaction.typeof === 'Income' ? '+' : '-'}₹{transaction.amount}</span>
                            <button className="delete-btn" onClick={() => deleteItem(transaction.id)}>x</button>
                        </li>
                    ))}
                </ul>
            </>

            <>
                <h3>Add new transaction</h3>
                {message && <Message message={message} colour={colour} />}
                <form id="form" onSubmit={addTransaction}>
                    <div className="form-control">
                        <label htmlFor="text">Transaction Title</label>
                        <input type="text" id="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter text..." />
                    </div>
                    <div className="form-control">
                        <label htmlFor="dropdown">Type of Transaction</label>
                        <select id="dropdown" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                            <option value="" disabled>Select an option</option>
                            <option value="Income">Income</option>
                            <option value="Expenditure">Expense</option>
                        </select>
                    </div>

                    {selectedOption === 'Income' && <IncomeDropdown />}
                    {selectedOption === 'Expenditure' && <ExpenditureDropdown />}

                    <div className="form-control">
                        <label htmlFor="amount"
                        >Amount </label>
                        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount..." />
                    </div>
                    <button className="btn">Add transaction</button>
                </form>
            </>

            <button className="btn" style={{ backgroundColor: "#FF6961" }} onClick={logout}>LOGOUT USER</button>
        </div>

    )
}
