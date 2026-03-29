import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

function TourCard({ tour, bookTour, currentUser }) {
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);

  // 1. Завантажуємо існуючі відгуки для цього туру з Firebase
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Звертаємося до підколекції "reviews" всередині конкретного туру
        const reviewsRef = collection(db, "tours", tour.id, "reviews");
        const querySnapshot = await getDocs(reviewsRef);
        const loadedReviews = querySnapshot.docs.map(doc => doc.data());
        setReviews(loadedReviews);
      } catch (error) {
        console.error("Помилка завантаження відгуків:", error);
      }
    };
    fetchReviews();
  }, [tour.id]);

  // 2. Функція для додавання нового відгуку
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!currentUser) return; // Захист: якщо не увійшов, функція не спрацює

    const newReview = {
      text: reviewText,
      rating: rating,
      userEmail: currentUser.email, // Записуємо пошту автора
      date: new Date().toLocaleDateString()
    };

    try {
      const reviewsRef = collection(db, "tours", tour.id, "reviews");
      await addDoc(reviewsRef, newReview); // Зберігаємо в базу
      setReviews([...reviews, newReview]); // Миттєво малюємо на екрані
      setReviewText(''); // Очищаємо поле вводу
      setRating(5); // Скидаємо зірочки на 5
    } catch (error) {
      alert("Помилка додавання відгуку: " + error.message);
    }
  };

  return (
    <article className="tour-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="tour-image">
        <img src={tour.img} alt={tour.title} />
      </div>
      <div className="tour-info" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <h3>{tour.title}</h3>
        <p className="duration">⏳ {tour.duration}</p>
        <p className="price">{tour.price.toLocaleString()} грн</p>
        
        <button className="btn-book" onClick={() => bookTour(tour)}>
          Забронювати
        </button>

        {/* --- СЕКЦІЯ ВІДГУКІВ --- */}
        <div style={{ marginTop: '20px', borderTop: '2px dashed #eee', paddingTop: '15px', flexGrow: 1 }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Відгуки ({reviews.length})</h4>

          {/* Список залишених відгуків */}
          <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '15px' }}>
            {reviews.length === 0 && <p style={{ fontSize: '14px', color: '#7f8c8d', fontStyle: 'italic' }}>Ще немає відгуків. Будьте першим!</p>}
            
            {reviews.map((rev, index) => (
              <div key={index} style={{ background: '#f8f9fa', padding: '10px', borderRadius: '6px', marginBottom: '8px', fontSize: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <strong style={{ color: '#2c3e50' }}>{rev.userEmail.split('@')[0]}</strong> 
                  <span style={{ color: '#f1c40f', letterSpacing: '2px' }}>{'★'.repeat(rev.rating)}</span>
                </div>
                <p style={{ margin: 0, color: '#555' }}>{rev.text}</p>
              </div>
            ))}
          </div>

          {/* Форма відгуку (ПОКАЗУЄМО ТІЛЬКИ ЯКЩО АВТОРИЗОВАНИЙ) */}
          {currentUser ? (
            <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="5">⭐⭐⭐⭐⭐ Відмінно</option>
                <option value="4">⭐⭐⭐⭐ Добре</option>
                <option value="3">⭐⭐⭐ Нормально</option>
                <option value="2">⭐⭐ Погано</option>
                <option value="1">⭐ Жахливо</option>
              </select>
              <textarea
                placeholder="Напишіть свої враження..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
                rows="2"
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', fontFamily: 'inherit' }}
              />
              <button type="submit" style={{ padding: '8px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                 Залишити відгук
              </button>
            </form>
          ) : (
            <div style={{ background: '#ffeaa7', padding: '10px', borderRadius: '4px', textAlign: 'center', marginTop: 'auto' }}>
              <p style={{ fontSize: '13px', color: '#d35400', margin: 0, fontWeight: 'bold' }}>
                 Увійдіть в акаунт, щоб залишати відгуки та ставити оцінки.
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default TourCard;