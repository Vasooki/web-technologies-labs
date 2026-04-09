import React from 'react';
import Map from '../components/Map';

function Contacts() {
  return (
    <section>
      <h2 className="section-title">Зв'яжіться з нами та знайдіть нас</h2>
      
      {/* Вставляємо наш компонент Мапи */}
      <Map />

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p>Телефон: +38 (099) 123-45-67</p>
        <p>Email: info@travelworld.com</p>
        <p>м. Львів, вул. Степана Бандери, 12</p>
      </div>
    </section>
  );
}

export default Contacts;