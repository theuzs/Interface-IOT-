import React, { useEffect, useState } from 'react';
import './App.css';
import { FaSun, FaMoon, FaClock, FaTint } from 'react-icons/fa';
import { GiWaterDrop } from 'react-icons/gi';
import { FaDollarSign } from 'react-icons/fa';
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
      console.log("Resposta da API:", response); // Log para verificar a resposta da API
      if (response.data.length > 0) {
        console.log("Dados recebidos:", response.data); // Log para ver os dados recebidos
        setDataEntries(response.data);
      } else {
        console.log("Nenhum dado encontrado."); // Log caso não haja dados
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const calculateMonthlyCost = async () => {
    const url = "https://swlqklamjvoaketmrbpq.supabase.co/rest/v1/consumo";
    const headers = {
      "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bHFrbGFtanZvYWtldG1yYnBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc5MTE2ODMsImV4cCI6MjA0MzQ4NzY4M30._ZkX67lLSqcMRdnRRaj79wxU0b9WlOdHToYkq4IR5WM",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bHFrbGFtanZvYWtldG1yYnBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc5MTE2ODMsImV4cCI6MjA0MzQ4NzY4M30._ZkX67lLSqcMRdnRRaj79wxU0b9WlOdHToYkq4IR5WM" // Insira seu token aqui
    };
    try {
      const response = await axios.get(url, { headers });
      const data = response.data;
      console.log("Dados para cálculo do custo:", data); // Log dos dados utilizados para o cálculo
      const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
      const totalVolume = data.reduce((sum, item) => {
        return item.data.startsWith(currentMonth) ? sum + parseFloat(item.volume) : sum;
      }, 0);
      const costPerLiter = 0.05; // Exemplo de custo por litro
      console.log("Volume total:", totalVolume, "Custo por litro:", costPerLiter); // Log do volume e custo
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
  console.log("Último registro:", lastEntry); // Log para verificar o último registro

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
        <p>Data: <span>{lastEntry.data}</span></p>
        <p>Hora: <span>{lastEntry.hora}</span></p>
        <p>
          Volume: <span>{lastEntry.volume.toFixed(2)} L/h</span>
          <GiWaterDrop className='icon' />
        </p>
        <p>
          Total: <span>{lastEntry.total.toFixed(2)} L</span>
          <GiWaterDrop className='icon' />
        </p>
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
<footer className="App-footer">
  <p>&copy; 2024 Matheus Fagundes - Vinicius Atanasio. Todos os direitos reservados.</p>
</footer>
</div>
  );
}

export default App;
