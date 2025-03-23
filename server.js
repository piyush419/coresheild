import express from 'express'
import dotenv from 'dotenv'
const app = express();
dotenv.config()

app.set('view engine', 'ejs');
app.set('views', './views'); 


const locations = [
    { "id": "loc_01", "latitude": 37.7749, "longitude": -122.4194 },
    { "id": "loc_04", "latitude": 27.8749, "longitude": 122.4194 },
    { "id": "loc_05", "latitude": 57.2749, "longitude": -112.4344 },
    { "id": "loc_06", "latitude": 14.0522, "longitude": -119.2531 },
    { "id": "loc_07", "latitude": 64.0522, "longitude": -108.2330 },
    { "id": "loc_02", "latitude": 34.0522, "longitude": -118.2437 },
    { "id": "loc_08", "latitude": 24.0522, "longitude": -168.2197 },
    { "id": "loc_03", "latitude": 40.7128, "longitude": -74.0060 }
];

const metadata = [
    { "id": "loc_01", "type": "restaurant", "rating": 4.5, "reviews": 120 },
    { "id": "loc_04", "type": "restaurant", "rating": 4.1, "reviews": 500 },
    { "id": "loc_05", "type": "restaurant", "rating": 3.7, "reviews": 110 },
    { "id": "loc_02", "type": "hotel", "rating": 4.2, "reviews": 200 },
    { "id": "loc_06", "type": "hotel", "rating": 4.0, "reviews": 700 },
    { "id": "loc_07", "type": "hotel", "rating": 2.0, "reviews": 900 },
    { "id": "loc_03", "type": "cafe", "rating": 4.7, "reviews": 150 },
    { "id": "loc_08", "type": "cafe", "rating": 4.5, "reviews": 750 }
];


app.get('/', (req, res) => {
    const mergedData = [];

   
    for (let i = 0; i < metadata.length; i++) {
        const meta = metadata[i];
        const loc = locations.find(location => location.id === meta.id);
        if (loc) {
            mergedData.push({ ...loc, ...meta });
        }
    }

   
    const typeCount = {};
    const typeRatingSum = {};
    const typeReviewSum = {};

    for (let i = 0; i < mergedData.length; i++) {
        const loc = mergedData[i];
        const { type, rating, reviews } = loc;

        typeCount[type] = (typeCount[type] || 0) + 1;
        typeRatingSum[type] = (typeRatingSum[type] || 0) + rating;
        typeReviewSum[type] = (typeReviewSum[type] || 0) + reviews;
    }

    
    const typeAvgRating = {};
    for (const type in typeCount) {
        typeAvgRating[type] = typeRatingSum[type] / typeCount[type];
    }

   
    let maxReviews = 0;
    let topLocation = null;
    for (let i = 0; i < mergedData.length; i++) {
        const loc = mergedData[i];
        if (loc.reviews > maxReviews) {
            maxReviews = loc.reviews;
            topLocation = loc;
        }
    }

    
    const incompleteData = mergedData.filter(loc => Object.values(loc).includes(null) || Object.values(loc).includes(''));

    
    res.render('index', {
        typeCount,
        typeAvgRating,
        topLocation,
        incompleteData
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
