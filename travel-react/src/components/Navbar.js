import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

// Тепер Navbar приймає currentUser з App.js
function Navbar({ currentUser }) {
  
  // Функція для виходу з акаунту
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Ви вийшли з акаунту");
    } catch (error) {
      console.error("Помилка виходу:", error);
    }
  };

  return (
    <header className="hero-section">
      <div className="overlay"></div>
      <div className="header-content">
        <h1>TravelWorld</h1>
        <p>Ваш надійний провідник у світі подорожей</p>
        <nav>
          <ul style={{ display: 'flex', gap: '20px', justifyContent: 'center', listStyle: 'none', alignItems: 'center' }}>
            <li><Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Гарячі тури</Link></li>
            
            {/* Показуємо "Мої бронювання" ТІЛЬКИ якщо користувач увійшов */}
            {currentUser && (
              <li><Link to="/bookings" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Мої бронювання</Link></li>
            )}
            
            <li><Link to="/contacts" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Контакти</Link></li>
            
            {/* Блок авторизації (Вхід / Вихід) */}
            {currentUser ? (
              <li style={{ marginLeft: '30px', color: '#f1c40f', fontWeight: 'bold' }}>
                Привіт, {currentUser.email}!
                <button onClick={handleLogout} style={{ marginLeft: '15px', padding: '5px 10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Вийти
                </button>
              </li>
            ) : (
              <li style={{ marginLeft: '30px' }}>
                <Link to="/auth" style={{ padding: '8px 15px', background: '#3498db', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                  Увійти
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;