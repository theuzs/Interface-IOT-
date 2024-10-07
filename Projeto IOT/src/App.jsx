import React, { useEffect, useState } from 'react';
import './App.css';
import { FaSun, FaMoon, FaClock, FaTint } from 'react-icons/fa';
import { GiWaterDrop } from 'react-icons/gi';
import axios from 'axios';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [dataEntries, setDataEntries] = useState([]);
  const [monthlyCost, setMonthlyCost] = useState(0);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  const fetchData = async () => {
    const url = "https://swlqklamjvoaketmrbpq.supabase.co/rest/v1/consumo";
    const headers = {
      "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bHFrbGFtanZvYWtldG1yYnBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc5MTE2ODMsImV4cCI6MjA0MzQ4NzY4M30._ZkX67lLSqcMRdnRRaj79wxU0b9WlOdHToYkq4IR5WM", // Insira sua chave API aqui
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bHFrbGFtanZvYWtldG1yYnBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc5MTE2ODMsImV4cCI6MjA0MzQ4NzY4M30._ZkX67lLSqcMRdnRRaj79wxU0b9WlOdHToYkq4IR5WM" // Insira seu token aqui
    };
    try {
      const response = await axios.get(url, { headers });
      if (response.data.length > 0) {
        setDataEntries(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const calculateMonthlyCost = async () => {
    const url = "https://swlqklamjvoaketmrbpq.supabase.co/rest/v1/consumo";
    const headers = {
      "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bHFrbGFtanZvYWtldG1yYnBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc5MTE2ODMsImV4cCI6MjA0MzQ4NzY4M30._ZkX67lLSqcMRdnRRaj79wxU0b9WlOdHToYkq4IR5WM", // Insira sua chave API aqui
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bHFrbGFtanZvYWtldG1yYnBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc5MTE2ODMsImV4cCI6MjA0MzQ4NzY4M30._ZkX67lLSqcMRdnRRaj79wxU0b9WlOdHToYkq4IR5WM" // Insira seu token aqui
    };
    try {
      const response = await axios.get(url, { headers });
      const data = response.data;
      const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
      const totalVolume = data.reduce((sum, item) => {
        return item.data.startsWith(currentMonth) ? sum + parseFloat(item.volume) : sum;
      }, 0);
      const costPerLiter = 0.005; // Exemplo de custo por litro
      setMonthlyCost(totalVolume * costPerLiter);
    } catch (error) {
      console.error("Erro ao calcular custo mensal:", error);
    }
  };

  useEffect(() => {
    fetchData();
    calculateMonthlyCost();
    const interval = setInterval(() => {
      fetchData();
      calculateMonthlyCost();
    }, 1000); // Atualiza a cada 1 segundo

    return () => clearInterval(interval);
  }, []);

  const lastEntry = dataEntries[dataEntries.length - 1];

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="animated-gradient-text">Controle de Água</h1>
        <button
          onClick={toggleTheme}
          className={`toggle-theme-button ${darkMode ? 'dark-mode' : 'light-mode'}`}
        >
          {darkMode ? <FaSun className='icon' /> : <FaMoon className='icon' />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      <div className="content">
        {lastEntry && (
          <div className="info-card">
            <h2 className="animated-gradient-text"><FaTint className='icon' /> Último Registro</h2>
            <p> Data: <span>{lastEntry.data}</span></p>
            <p> Hora: <span>{lastEntry.hora}</span></p>
            <p><GiWaterDrop className='icon' /> Volume: <span>{lastEntry.volume.toFixed(2)} L</span></p>
            <p><GiWaterDrop className='icon' /> Total: <span>{lastEntry.total.toFixed(2)} L</span></p>
          </div>
        )}

        <div className="clock">
          <p><FaClock className='icon' /> {new Date().toLocaleTimeString()}</p>
        </div>

        <div className="monthly-cost">
          <h2 className="animated-gradient-text">Custo do Mês</h2>
          <p>R$ {monthlyCost.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
