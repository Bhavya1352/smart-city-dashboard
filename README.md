# 🏙️ Smart City Dashboard

A real-time, visually rich, and animated dashboard that displays live data for any city — including weather, air quality, public transport, and traffic updates.

![Smart City Dashboard](https://img.shields.io/badge/Status-Complete-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)

## ✨ Features

### 🎨 Frontend Features
- **Modern Glassmorphism UI** with neon city theme
- **Responsive Design** that works on all devices
- **Smooth Animations** using Framer Motion
- **Interactive Charts** with Chart.js and gradient backgrounds
- **Real-time Map** with Leaflet.js showing transport locations
- **City Search** with animated input and loading states
- **Dark/Light Mode** toggle
- **Smart Insights** with AI-powered recommendations

### ⚙️ Backend Features
- **Real API Integration** with OpenWeatherMap and AQICN
- **Intelligent Caching** (10 minutes for weather/air quality, 5 minutes for transport)
- **PostgreSQL Database** for data persistence
- **JWT Authentication** for user management
- **RESTful API** with comprehensive error handling
- **Rate Limiting Protection** to avoid API limits

### 📊 Data Sources
- **Weather**: OpenWeatherMap API (with fallback to realistic mock data)
- **Air Quality**: AQICN API (with AQI status calculation)
- **Transport**: Time-based realistic simulation (expandable to real APIs)
- **Maps**: OpenStreetMap with Leaflet.js

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 15+
- npm or yarn

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd traffic
```

### 2. Backend Setup
```bash
cd server
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your database URL and API keys
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb smartcity

# Update DATABASE_URL in .env file
DATABASE_URL=postgresql://username:password@localhost:5432/smartcity
```

### 4. API Keys (Optional but Recommended)
Get free API keys from:
- [OpenWeatherMap](https://openweathermap.org/api) for weather data
- [AQICN](https://aqicn.org/api/) for air quality data

Add them to your `.env` file:
```env
OPENWEATHER_API_KEY=your_key_here
AQICN_API_KEY=your_key_here
```

### 5. Start Backend Server
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

### 6. Frontend Setup
```bash
cd client
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

## 🏗️ Project Structure

```
traffic/
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   └── styles/        # Global styles
│   ├── package.json
│   └── tailwind.config.ts
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── controllers/   # API controllers
│   │   ├── routes/        # Express routes
│   │   └── database/      # Database configuration
│   ├── index.js
│   └── package.json
└── README.md
```

## 🎯 API Endpoints

### Weather
- `GET /api/weather?city=Delhi` - Get weather data for a city

### Air Quality
- `GET /api/airquality?city=Delhi` - Get air quality data for a city

### Transport
- `GET /api/transport?city=Delhi` - Get transport data for a city

### Insights
- `GET /api/insights?city=Delhi` - Get AI-powered insights for a city

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/favorite-city` - Update favorite city

## 🎨 UI Components

### Core Components
- **WeatherCard**: Displays temperature, humidity, and conditions with animated icons
- **AirQualityCard**: Shows AQI with color-coded status and progress bars
- **TransportCard**: Transport info with traffic indicators and bus counts
- **ChartCard**: Interactive charts showing daily trends
- **MapCard**: Interactive map with transport locations
- **Navbar**: Search functionality with theme toggle

### Animations
- **Framer Motion**: Smooth page transitions and component animations
- **CSS Keyframes**: Background gradients and loading effects
- **Chart.js**: Animated data visualization
- **Glassmorphism**: Modern backdrop-blur effects

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/smartcity
OPENWEATHER_API_KEY=your_openweather_api_key
AQICN_API_KEY=your_aqicn_api_key
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Tailwind Configuration
The project uses a custom Tailwind configuration with:
- Custom color palette for glassmorphism
- Extended animations and transitions
- Responsive breakpoints
- Custom utilities for backdrop effects

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints:
- **Mobile**: < 768px (single column layout)
- **Tablet**: 768px - 1024px (2 column layout)
- **Desktop**: > 1024px (3+ column layout)

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy to Vercel
```

### Backend (Railway/Render)
```bash
cd server
# Deploy to Railway or Render with PostgreSQL addon
```

### Environment Setup for Production
- Set all environment variables in your hosting platform
- Ensure DATABASE_URL points to your production database
- Add your domain to CORS configuration

## 🔮 Advanced Features

### Smart Insights Engine
The dashboard includes an AI-powered insights system that:
- Analyzes weather patterns and provides recommendations
- Monitors air quality trends and health advisories
- Suggests optimal travel times based on traffic data
- Provides personalized recommendations based on user preferences

### Caching Strategy
- **Memory Cache**: Node-cache for immediate responses
- **Database Cache**: PostgreSQL for persistent caching
- **Time-based Invalidation**: Automatic cache refresh
- **Fallback System**: Graceful degradation to mock data

### Authentication System
- **JWT-based**: Secure token authentication
- **User Preferences**: Save favorite cities
- **Session Management**: Automatic token refresh
- **Password Security**: Bcrypt hashing

## 🛠️ Development

### Adding New Cities
The system automatically adapts to any city name. To add specific configurations:

1. Update city coordinates in `MapCard.tsx`
2. Add city-specific multipliers in `transportController.js`
3. Configure any city-specific API endpoints

### Adding New Data Sources
1. Create new controller in `src/controllers/`
2. Add routes in `src/routes/`
3. Create corresponding React component
4. Update main dashboard to include new component

### Customizing Animations
- Modify Framer Motion variants in components
- Update CSS keyframes in `globals.css`
- Adjust Chart.js animation settings in `ChartCard.tsx`

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Verify database exists

**API Rate Limits**
- The system includes caching to prevent rate limits
- Mock data is used as fallback
- Consider upgrading API plans for high usage

**Build Errors**
- Clear node_modules and reinstall dependencies
- Check Node.js version compatibility
- Ensure all environment variables are set

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ using Next.js, Node.js, and PostgreSQL**