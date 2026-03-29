import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Bookings from './pages/Bookings';
import Contacts from './pages/Contacts';
import AuthPage from './pages/AuthPage'; // <--- НОВЕ: Імпорт сторінки
import { auth } from './firebase'; // <--- НОВЕ: Імпорт auth
import { onAuthStateChanged } from 'firebase/auth'; // <--- НОВЕ: Відстеження стану
import './App.css';

function App() {
  const [myBookings, setMyBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // <--- НОВЕ: Стан для користувача

  // НОВЕ: Відстежуємо, чи увійшов користувач
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const bookTour = (tour) => {
    // ТИМЧАСОВА ПЕРЕВІРКА: чи увійшов користувач
    if (!currentUser) {
      alert("Тільки зареєстровані користувачі можуть бронювати тури! Будь ласка, увійдіть.");
      return;
    }

    if (myBookings.some(b => b.id === tour.id)) {
      alert('Цей тур вже є у ваших бронюваннях!');
      return;
    }
    setMyBookings([...myBookings, tour]);
    alert(`Тур "${tour.title}" успішно заброньовано! Перейдіть у "Мої бронювання"`);
  };

  return (
    <Router>
      <div className="App">
        {/* Передаємо користувача в Navbar, щоб змінювати кнопки меню */}
        <Navbar currentUser={currentUser} />
        <main>
          <Routes>
            <Route path="/" element={<Home bookTour={bookTour} currentUser={currentUser} />} />
            <Route path="/bookings" element={<Bookings myBookings={myBookings} />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/auth" element={<AuthPage />} /> {/* <--- НОВЕ: Маршрут для входу */}
          </Routes>
        </main>
        <footer>
          <p>© 2026 TravelWorld. Національний університет "Львівська політехніка"</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;