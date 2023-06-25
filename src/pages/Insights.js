import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import Message from './Message';
import { Link } from 'react-router-dom';

export const Insights = () => {
  const [incomeCats, setIncomeCats] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [incomeMessage,setIncomeMessage] = useState('');

  const [expenseMessage,setExpenseMessage] = useState('');
  const [expenseCats, setExpenseCats] = useState([]);
  const [Expenseamounts, setExpenseAmounts] = useState([]);

  const fetchIncomeCat = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const response = await fetch(process.env.REACT_APP_BASE_URL + '/expense/income-group-wise/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setIncomeCats(data.data.categories);
      setAmounts(data.data.amount);
      setIncomeMessage(data.message);
      console.log(data.message);
    } catch (error) {
      console.error('Error fetching income:', error);
    }
  };

  const fetchExpenseCat = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const response = await fetch(process.env.REACT_APP_BASE_URL + '/expense/expense-group-wise/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setExpenseCats(data.data.categories);
      setExpenseAmounts(data.data.amount);
      setExpenseMessage(data.message);
      console.log(data.message);
    } catch (error) {
      console.error('Error fetching income:', error);
    }
  };

  const chartDataIncome = {
    labels: incomeCats,
    datasets: [
      {
        data: amounts,
        backgroundColor: ['#2E8B57', '#c0392b', '#FFA500', '#800080', '#1E90FF', '#FFC0CB'],
        hoverBackgroundColor: ['#4CAF50', 'rgb(255, 105, 97)', '#FFD700', '#9932CC', '#00BFFF', '#FFA07A'],
      },
    ],
  };

  const chartDataExpense = {
    labels: expenseCats,
    datasets: [
      {
        data: Expenseamounts,
        backgroundColor: ['#2E8B57', '#c0392b', '#FFA500', '#800080', '#1E90FF', '#FFC0CB', '#FF8C00'],
        hoverBackgroundColor: ['#4CAF50', 'rgb(255, 105, 97)', '#FFD700', '#9932CC', '#00BFFF', '#FFA07A', '#FFA500'],
      },
    ],
  };

  useEffect(() => {
    fetchIncomeCat();
    fetchExpenseCat();
  }, []);

  return (
    <div>
        <br></br>
        <Link to="/"> ← Go Back</Link>
      <h2>Transaction Insights</h2>
      <div className="container">
      {incomeMessage && <Message message={incomeMessage} colour="#90EE90" />}
        <h3 className="chart-title">Category Wise Income Chart</h3>
        <div className="chart-box">
          <Pie data={chartDataIncome} />
        </div>
        <br></br>
      </div>

      <div className="container">
      {expenseMessage && <Message message={expenseMessage} colour="#FF6961" />}
        <h3 className="chart-title">Category Wise Expense Chart</h3>
        <div className="chart-box">
          <Pie data={chartDataExpense} />
        </div>
        <br></br>
      </div>

      
    </div>
  );
};
