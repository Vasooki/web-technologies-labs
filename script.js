const toursData = [
    { id: 1, title: 'Шарм-ель-Шейх, Єгипет', duration: '7 ночей • Все включено', price: 15000, img: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=600&q=80' },
    { id: 2, title: 'Магія Карпат, Україна', duration: '5 днів • Сніданки', price: 8500, img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80' },
    { id: 3, title: 'Римські канікули, Італія', duration: '4 дні • Екскурсії', price: 12200, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' }
];

const mapLocations = [
    { id: 'egypt', name: "Єгипет, Шарм-ель-Шейх", top: "39%", left: "57%", info: "Ідеальне місце для дайвінгу у Червоному морі та відпочинку за системою All Inclusive." },
    { id: 'ukraine', name: "Україна, Карпати", top: "23%", left: "56%", info: "Мальовничі гори, чисте повітря та гуцульський колорит. Сходження на Говерлу." },
    { id: 'italy', name: "Італія, Рим", top: "28%", left: "52%", info: "Вічне місто. Відвідайте Колізей, Пантеон та скуштуйте справжню італійську піцу." }
];

let myBookings = JSON.parse(localStorage.getItem('myTours')) || [];

function renderTours() {
    const container = document.getElementById('tours-container');
    container.innerHTML = ''; 
    let i = 0;

    while (i < toursData.length) {
        const tour = toursData[i];
        
        const isBooked = myBookings.some(b => b.id === tour.id);
        const cardClass = isBooked ? 'tour-card enlarged' : 'tour-card';
        const btnText = isBooked ? 'Заброньовано' : 'Забронювати';
        const btnColor = isBooked ? '#7f8c8d' : ''; 

        const article = document.createElement('article');
        article.className = cardClass;
        article.id = `tour-card-${tour.id}`;
        
        article.innerHTML = `
            <div class="tour-image">
                <img src="${tour.img}" alt="${tour.title}">
            </div>
            <div class="tour-info">
                <h3>${tour.title}</h3>
                <p class="duration">${tour.duration}</p>
                <p class="price">${tour.price.toLocaleString()} грн</p>
                <button class="btn-book" style="background-color: ${btnColor}" onclick="bookTour(${tour.id})">${btnText}</button>
            </div>
        `;
        
        container.appendChild(article);
        i++;
    }
}

window.bookTour = function(tourId) {
    const tour = toursData.find(t => t.id === tourId);
    
    if (myBookings.some(b => b.id === tourId)) {
        alert("Цей тур вже є у ваших бронюваннях!");
        return;
    }

    myBookings.push(tour);
    localStorage.setItem('myTours', JSON.stringify(myBookings));

    renderTours(); 
    renderBookings(); 
};

window.cancelBooking = function(tourId) {
    myBookings = myBookings.filter(b => b.id !== tourId);
    localStorage.setItem('myTours', JSON.stringify(myBookings));
    renderTours();
    renderBookings();
};

function renderBookings() {
    const grid = document.getElementById('bookings-grid');
    grid.innerHTML = ''; 

    if (myBookings.length === 0) {
        grid.innerHTML = `<p id="empty-booking-msg" style="text-align: center; color: #7f8c8d; font-style: italic;">Ви ще не забронювали жодного туру. Оберіть подорож вище!</p>`;
        return;
    }

    let totalCost = 0;

    myBookings.forEach(tour => {
        totalCost += tour.price;
        
        const item = document.createElement('div');
        item.className = 'booking-card';
        item.innerHTML = `
            <div class="booking-details">
                <h4>${tour.title}</h4>
                <p>Вартість: ${tour.price.toLocaleString()} грн</p>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="status confirmed">Підтверджено</span>
                <button onclick="cancelBooking(${tour.id})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Скасувати</button>
            </div>
        `;
        grid.appendChild(item);
    });

    const totalDiv = document.createElement('div');
    totalDiv.style.textAlign = 'right';
    totalDiv.style.marginTop = '15px';
    totalDiv.style.fontSize = '1.2rem';
    totalDiv.style.fontWeight = 'bold';
    totalDiv.innerHTML = `Загальна сума: <span style="color: #27ae60;">${totalCost.toLocaleString()} грн</span>`;
    grid.appendChild(totalDiv);
}

function initMap() {
    const mapContainer = document.getElementById('map-container');
    
    const infoBox = document.createElement('div');
    infoBox.className = 'map-info-box';
    infoBox.id = 'map-info';
    mapContainer.appendChild(infoBox);

    mapLocations.forEach(loc => {
        const marker = document.createElement('div');
        marker.className = 'map-marker';
        marker.style.top = loc.top;
        marker.style.left = loc.left;
        marker.title = loc.name;

        marker.addEventListener('click', function(event) {
            document.querySelectorAll('.map-marker').forEach(m => m.classList.remove('active'));
            this.classList.add('active');

            infoBox.innerHTML = `
                <h4>${loc.name}</h4>
                <p>${loc.info}</p>
                <button onclick="document.getElementById('map-info').style.display='none'" style="margin-top:10px; padding: 5px 10px; background:#333; color:#fff; border:none; border-radius:4px; cursor:pointer;">Закрити</button>
            `;
            infoBox.style.display = 'block';
        });

        mapContainer.appendChild(marker);
    });
}

document.querySelector('.contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    const name = this.querySelector('input[type="text"]').value;
    
    this.innerHTML = `
        <div style="text-align: center; padding: 20px; background: #e8f5e9; border-radius: 8px; color: #2e7d32;">
            <h3>Дякуємо, ${name}!</h3>
            <p>Ваш запит успішно відправлено. Наші менеджери зв'яжуться з вами найближчим часом.</p>
        </div>
    `;
});

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    renderTours();
    renderBookings();
    initMap();
});