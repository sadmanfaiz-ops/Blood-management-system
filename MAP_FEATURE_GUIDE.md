# 🗺️ Map Feature Guide - Blood Donation System

## Overview
The Map Feature allows recipients to find available blood donors near their location using an interactive map with geolocation and filtering capabilities.

---

## 🚀 Quick Start

### For Recipients:
1. **Log in** as a recipient
2. **Click "🗺️ Map"** in the navbar (visible on index.html, donors.html, or directly access `map.html`)
3. **Enter your location** by:
   - Selecting a region from the dropdown (Dhaka, Chattogram, Sylhet, etc.)
   - OR clicking **"📍 My Location"** to use GPS
   - OR manually entering latitude/longitude coordinates
4. **Select blood group** (optional)
5. **Click "Search"** to find nearby donors
6. **Contact or Request** blood from donors shown on the map

---

## 🎯 Features

### Location Detection
- **GPS Detection**: Click "📍 My Location" to get your current coordinates
- **Region Selection**: Choose from 50+ predefined regions in Bangladesh with accurate coordinates
- **Manual Entry**: Enter latitude/longitude manually for precise locations

### Search Filters
- **Blood Group**: Filter donors by specific blood groups (O+, O-, A+, A-, B+, B-, AB+, AB-)
- **Search Radius**: Set distance range (1-50 km) to find donors near you
- **Availability Status**: Only shows approved donors who are available

### Interactive Map
- **Real-time Markers**: Color-coded donor markers by blood group
- **Distance Display**: Shows exact distance in kilometers
- **Donor Information**: Click markers to see donor details
- **Map Controls**: Pan, zoom, and interact with the map freely

### Donor List Sidebar
- **Sorted by Distance**: Closest donors appear first
- **Donor Cards**: Quick view of name, blood group, location, phone, availability
- **Contact Button**: Call or contact donors directly
- **Request Button**: Quick request blood feature

---

## 📍 Supported Regions

The system includes accurate coordinates for 50+ regions in Bangladesh:

### Dhaka Division
- dhaka, dacca, gulshan, banani, uttara, dhanmondi, motijheel, mirpur
- narayanganj, gazipur, tangail, mymensingh

### Chattogram Division
- chattogram, chittagong, ctg, cox's bazar, cox bazar
- sylhet, feni, noakhali, comilla, cumilla

### Rajshahi Division
- rajshahi, bogra, bogura, pabna, dinajpur
- rangpur, thakurgaon, panchagarh

### Khulna Division
- khulna, bagerhat, jashore, jessore

### Barishal Division
- barisal, barishal, patuakhali, pirojpur
- jhalokati, gopalganj

### Other Regions
- manikganj, madaripur, shariatpur, munshiganj

---

## 🔄 How It Works Behind the Scenes

### 1. **Donor Registration**
When donors register:
- Their location (region or city) is automatically converted to GeoJSON coordinates
- Coordinates are stored in MongoDB with 2dsphere geospatial indexing
- System uses `regionCoordinates.js` to map region names to exact coordinates

### 2. **Geolocation Search**
When recipients search:
- Browser detects GPS location (if "My Location" clicked)
- System queries MongoDB using geospatial aggregation (`$geoNear`)
- Results are sorted by distance from user's location
- Distance calculated in meters, converted to kilometers for display

### 3. **Map Visualization**
The Leaflet.js library handles:
- OpenStreetMap tiles for the map background
- Color-coded circular markers for each donor
- Popup windows with donor details on marker click
- User location marked with a blue circle

---

## 📲 API Endpoints Used

### Get Nearest Donors
```
GET /api/donors/nearest?lat=23.8103&lng=90.4125&radius=5&bloodGroup=O%2B
GET /api/donors/nearest?region=dhaka&radius=5&bloodGroup=O%2B
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "userLocation": {
    "latitude": 23.8103,
    "longitude": 90.4125,
    "region": "dhaka"
  },
  "donors": [
    {
      "name": "John Doe",
      "bloodGroup": "O+",
      "location": "Dhaka",
      "phone": "+880123456789",
      "distance": 2500,
      "distanceKm": "2.50",
      "availabilityStatus": "Available",
      "_id": "507f1f77bcf86cd799439011"
    }
  ]
}
```

### Get Available Regions
```
GET /api/donors/regions/list
```

---

## 🎨 Color Coding

Donor markers are color-coded by blood group:
- **🔴 Red shades**: O+, O-, A+, A-
- **🩷 Pink/Red**: B+, B-
- **💜 Purple**: AB+, AB-

---

## 🔐 Security & Permissions

- **Authentication Required**: Only logged-in recipients can access the map
- **Admin Access**: Admins can also use the map for monitoring
- **Data Privacy**: Only approved donors are shown (Pending/Rejected donors are hidden)
- **JWT Protection**: All API calls require valid JWT token

---

## ⚡ Performance Optimizations

1. **Geospatial Indexing**: MongoDB 2dsphere index for fast location queries
2. **Aggregation Pipeline**: Efficient $geoNear aggregation for distance calculation
3. **Result Limiting**: Max 20 donors returned per search to prevent overload
4. **Client-side Filtering**: Blood group filtering done before rendering

---

## 🐛 Troubleshooting

### Map Not Loading
- Check if Leaflet.js loaded successfully (check browser console)
- Verify internet connection for OpenStreetMap tiles
- Try refreshing the page

### GPS Not Working
- Enable location services in browser
- Check if website has permission to access GPS
- Try manual coordinate entry instead

### No Donors Found
- Expand search radius
- Try searching without blood group filter
- Ensure there are approved donors in the database

### Distance Calculation Wrong
- Verify user coordinates are correct
- Check if donor coordinates are properly set
- 2dsphere index might need rebuilding

---

## 📊 Database Schema

### Donor Model
```javascript
{
  name: String,
  bloodGroup: String,
  location: String,
  phone: String,
  availability: Boolean,
  availabilityStatus: String,
  status: String, // 'Approved', 'Pending', 'Rejected'
  coordinates: {
    type: 'Point',
    coordinates: [longitude, latitude] // GeoJSON format
  },
  userId: ObjectId,
  lastDonationDate: Date,
  timestamps: true
}
```

---

## 🚀 Future Enhancements

1. **Heatmap View**: Show donor density in different areas
2. **Route Navigation**: Integrate Google Maps directions
3. **Donor Ratings**: Show donor reviews/ratings on map
4. **Real-time Updates**: WebSocket updates for donor availability
5. **Multiple Markers**: Show hospitals/blood banks alongside donors
6. **Offline Mode**: Cache map data for offline access
7. **Mobile App**: Native mobile app with background location tracking

---

## 📞 Support

For issues or feature requests:
1. Check browser console for error messages
2. Verify MongoDB connection
3. Check API endpoint responses in Network tab
4. Review server logs for backend errors

---

**Last Updated:** January 2, 2026
**Version:** 1.0
