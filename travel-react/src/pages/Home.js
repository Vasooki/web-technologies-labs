import React, { useState, useEffect } from 'react';
import TourCard from '../components/TourCard';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

function Home({ bookTour, currentUser }) {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Функція, яка тягне тури з бази даних Firebase
  const fetchTours = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tours"));
      const toursArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTours(toursArray);
      setLoading(false);
    } catch (error) {
      console.error("Помилка завантаження з Firebase:", error);
    }
  };

  // Викликаємо завантаження при відкритті сторінки
  useEffect(() => {
    fetchTours();
  }, []);

  // 2. НАША СЕКРЕТНА КНОПКА (Додає тури в порожню базу)
  const seedDatabase = async () => {
    const myTours = [
      { title: "Єгипет, Шарм-ель-Шейх", price: 15000, duration: "7 днів", img: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=500" },
      { title: "Україна, Карпати", price: 8500, duration: "5 днів", img: "https://images.unsplash.com/photo-1563613946892-0b19280dcb45?w=500" },
      { title: "Італія, Рим", price: 22000, duration: "4 дні", img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500" }
    ];

    try {
      for (const tour of myTours) {
        await addDoc(collection(db, "tours"), tour);
      }
      alert("🔥 Тури успішно закинуті у Firebase! Сторінка оновиться.");
      window.location.reload();
    } catch (error) {
      alert("Помилка: " + error.message);
    }
  };

  // Функція сортування (працює як і раніше)
  const sortByPrice = () => {
    const sortedTours = [...tours].sort((a, b) => a.price - b.price);
    setTours(sortedTours);
  };

  return (
    <section>
      <div className="hero-content" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h2 className="section-title">Гарячі пропозиції</h2>
        <p>Оберіть тур своєї мрії за найкращою ціною!</p>
        
        {/* Кнопка сортування */}
        <button onClick={sortByPrice} style={{ margin: '20px', padding: '10px 20px', cursor: 'pointer', background: '#e67e22', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
          ⬇️ Сортувати за ціною (від дешевих)
        </button>

        {/* Якщо турів немає, показуємо ЧЕРВОНУ КНОПКУ */}
        {tours.length === 0 && !loading && (
          <div style={{ background: '#ffeaa7', padding: '20px', borderRadius: '10px', maxWidth: '500px', margin: '0 auto' }}>
            <h3>⚠️ База даних порожня!</h3>
            <button onClick={seedDatabase} style={{ background: '#d63031', color: 'white', padding: '15px 30px', fontSize: '18px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Натисни, щоб додати тури у Firebase
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <h3 style={{ textAlign: 'center' }}>Завантаження турів з хмари... ☁️</h3>
      ) : (
        <div className="tours-container">
          {tours.map(tour => (
            <TourCard key={tour.id} tour={tour} bookTour={bookTour} currentUser={currentUser} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Home;
