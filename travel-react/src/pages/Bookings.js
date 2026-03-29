import React from 'react';

// Приймаємо наш масив заброньованих турів з App.js
function Bookings({ myBookings }) {
  
  // Рахуємо загальну суму
  const totalCost = myBookings.reduce((sum, tour) => sum + tour.price, 0);

  return (
    <section className="alt-bg">
      <h2 className="section-title">Мої активні бронювання</h2>
      
      <div className="bookings-grid" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Якщо турів немає, показуємо повідомлення */}
        {myBookings.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#7f8c8d', fontStyle: 'italic' }}>
            Ви ще не забронювали жодного туру. Оберіть подорож на Головній сторінці!
          </p>
        ) : (
          /* Якщо тури є, малюємо їх циклом */
          myBookings.map(tour => (
            <div key={tour.id} className="booking-card" style={{ background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0' }}>{tour.title}</h4>
                <p style={{ margin: 0, color: '#27ae60', fontWeight: 'bold' }}>{tour.price.toLocaleString()} грн</p>
              </div>
              <span style={{ background: '#e8f5e9', color: '#27ae60', padding: '5px 10px', borderRadius: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                Підтверджено
              </span>
            </div>
          ))
        )}

        {/* Якщо є хоча б один тур, показуємо загальну суму */}
        {myBookings.length > 0 && (
          <div style={{ textAlign: 'right', marginTop: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
            Загальна сума: <span style={{ color: '#27ae60' }}>{totalCost.toLocaleString()} грн</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default Bookings;