import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // Перемикач: Вхід чи Реєстрація
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        // Логіка входу
        await signInWithEmailAndPassword(auth, email, password);
        alert("Успішний вхід!");
      } else {
        // Логіка реєстрації
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Акаунт створено!");
      }
      navigate('/'); // Повертаємо на головну сторінку після успіху
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>{isLogin ? 'Вхід' : 'Реєстрація'}</h2>
      
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Ваш Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        <input 
          type="password" 
          placeholder="Пароль (мінімум 6 символів)" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#2c3e50', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          {isLogin ? 'Увійти' : 'Зареєструватися'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px', cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Немає акаунту? Створити' : 'Вже є акаунт? Увійти'}
      </p>
    </section>
  );
}


export default AuthPage;