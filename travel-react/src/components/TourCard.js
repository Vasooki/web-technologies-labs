import React, { useState, useEffect } from 'react';

function TourCard({ tour, bookTour, currentUser }) {
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [averageRating, setAverageRating] = useState(0);

  // 1. ЗАВАНТАЖУЄМО ВІДГУКИ З НАШОГО СЕРВЕРА (БЕКЕНДУ)
  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tours/${tour.id}/reviews`);
      const data = await response.json();
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
    } catch (error) {
      console.error("Помилка завантаження відгуків з сервера:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [tour.id]);

  // 2. ВІДПРАВЛЯЄМО НОВИЙ ВІДГУК НА СЕРВЕР (ТАМ ПРАЦЮЄ ЦЕНЗУРА)
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const newReview = {
      text: reviewText,
      rating: rating,
      userEmail: currentUser.email,
      date: new Date().toLocaleDateString()
    };

    try {
      // Робимо POST запит на наш сервер
      const response = await fetch(`http://localhost:5000/api/tours/${tour.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });

      const data = await response.json();

      // Якщо сервер відбив запит (знайшов заборонене слово)
      if (!response.ok) {
        alert("🛑 СЕРВЕР ЗАБЛОКУВАВ ВІДГУК: " + data.error);
        return; 
      }

      // Якщо все чисто
      setReviewText('');
      setRating(5);
      fetchReviews(); // Оновлюємо список відгуків і рейтинг
      alert("✅ " + data.message);

    } catch (error) {
      alert("Помилка з'єднання з сервером. Перевірте, чи запущений Node.js сервер!");
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
        
        {/* --- ПОКАЗУЄМО СЕРЕДНІЙ РЕЙТИНГ --- */}
        <div style={{ background: '#ecf0f1', padding: '5px 10px', borderRadius: '5px', display: 'inline-block', marginBottom: '10px', fontWeight: 'bold' }}>
          🏆 Рейтинг туру: {averageRating > 0 ? `${averageRating} / 5.0` : 'Ще немає оцінок'}
        </div>
        
        <button className="btn-book" onClick={() => bookTour(tour)}>
          Забронювати
        </button>

        {/* --- СЕКЦІЯ ВІДГУКІВ --- */}
        <div style={{ marginTop: '20px', borderTop: '2px dashed #eee', paddingTop: '15px', flexGrow: 1 }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Відгуки ({reviews.length})</h4>

          <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '15px' }}>
            {reviews.length === 0 && <p style={{ fontSize: '14px', color: '#7f8c8d', fontStyle: 'italic' }}>Ще немає відгуків.</p>}
            
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
                required rows="2"
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
              />
              <button type="submit" style={{ padding: '8px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                ✍️ Залишити відгук
              </button>
            </form>
          ) : (
            <div style={{ background: '#ffeaa7', padding: '10px', borderRadius: '4px', textAlign: 'center', marginTop: 'auto' }}>
              <p style={{ fontSize: '13px', color: '#d35400', margin: 0, fontWeight: 'bold' }}>🔒 Увійдіть, щоб залишити відгук.</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default TourCard;