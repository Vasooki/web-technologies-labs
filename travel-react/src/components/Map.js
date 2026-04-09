import React, { useState } from 'react';

// Наші координати (ті самі, що ми ідеально підібрали в 2 лабці)
const mapLocations = [
    { id: 'egypt', name: "Єгипет, Шарм-ель-Шейх", top: "39%", left: "57%", info: "Ідеальне місце для дайвінгу у Червоному морі та відпочинку за системою All Inclusive." },
    { id: 'ukraine', name: "Україна, Карпати", top: "23%", left: "56%", info: "Мальовничі гори, чисте повітря та гуцульський колорит. Сходження на Говерлу." },
    { id: 'italy', name: "Італія, Рим", top: "28%", left: "52%", info: "Вічне місто. Відвідайте Колізей, Пантеон та скуштуйте справжню італійську піцу." }
];

function Map() {
  // Стан для збереження активного маркера (віконця)
  const [activeMarker, setActiveMarker] = useState(null);

  return (
    <div className="interactive-map-wrapper" style={{ position: 'relative' }}>
      
      {/* Малюємо маркери циклом .map */}
      {mapLocations.map(loc => (
        <div
          key={loc.id}
          className={`map-marker ${activeMarker?.id === loc.id ? 'active' : ''}`}
          style={{ top: loc.top, left: loc.left, position: 'absolute' }}
          onClick={() => setActiveMarker(loc)}
          title={loc.name}
        ></div>
      ))}

      {/* Якщо є клік по маркеру (activeMarker не порожній), показуємо віконце */}
      {activeMarker && (
        <div className="map-info-box" style={{ display: 'block' }}>
          <h4>{activeMarker.name}</h4>
          <p>{activeMarker.info}</p>
          <button 
            onClick={() => setActiveMarker(null)} 
            style={{ marginTop: '10px', padding: '5px 10px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Закрити
          </button>
        </div>
      )}

    </div>
  );
}

export default Map;