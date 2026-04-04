const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin"); 

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. GET-маршрут: Отримання відгуків (з середнім рейтингом та сортуванням)
// ==========================================
app.get("/api/tours/:tourId/reviews", async (req, res) => {
  try {
    const { tourId } = req.params; // Беремо ID туру з URL
    const reviewsRef = db.collection("tours").doc(tourId).collection("reviews");
    const snapshot = await reviewsRef.get();

    if (snapshot.empty) {
      return res.json({ averageRating: 0, reviews: [] });
    }

    let totalRating = 0;
    let reviews = [];

    // Збираємо всі відгуки
    snapshot.forEach(doc => {
      const data = doc.data();
      reviews.push({ id: doc.id, ...data });
      totalRating += Number(data.rating) || 0; // Додаємо зірочки до загальної суми
    });

    // Рахуємо середній рейтинг і залишаємо 1 знак після коми
    const averageRating = (totalRating / reviews.length).toFixed(1);

    // Сортуємо відгуки за рейтингом: від найбільшого до найменшого
    reviews.sort((a, b) => b.rating - a.rating);

    // Відправляємо готові дані клієнту
    res.json({ averageRating, reviews });
  } catch (error) {
    console.error("Помилка отримання відгуків:", error);
    res.status(500).json({ error: "Не вдалося отримати відгуки" });
  }
});

// ==========================================
// 2. POST-маршрут: Додавання відгуку (із ЦЕНЗУРОЮ)
// ==========================================
app.post("/api/tours/:tourId/reviews", async (req, res) => {
  try {
    const { tourId } = req.params;
    const newReview = req.body; // Текст, рейтинг, пошта, дата від юзера

    // НАШ ЧОРНИЙ СПИСОК СЛІВ
    const forbiddenWords = ["обман", "жах", "шахраї", "лайно", "погано"];

    // Перевіряємо текст відгуку на наявність заборонених слів
    const textToLower = newReview.text.toLowerCase();
    const containsForbidden = forbiddenWords.some(word => textToLower.includes(word));

    if (containsForbidden) {
      // Якщо знайшли погане слово - блокуємо збереження!
      return res.status(400).json({ 
        error: "Відгук містить заборонені слова і не може бути опублікований." 
      });
    }

    // Якщо все чисто - зберігаємо відгук у базу Firebase
    const reviewsRef = db.collection("tours").doc(tourId).collection("reviews");
    const addedDoc = await reviewsRef.add(newReview);

    res.status(201).json({ message: "Відгук успішно додано!", id: addedDoc.id });
  } catch (error) {
    console.error("Помилка додавання відгуку:", error);
    res.status(500).json({ error: "Не вдалося додати відгук" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});