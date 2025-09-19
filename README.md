# ShortURL Frontend 🚀

A modern, feature-rich URL shortening application built with React.js that allows users to create short URLs and track detailed analytics including click counts, IP addresses, device information, and geographic location data.

## 🌟 Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **Click Analytics**: Track total number of clicks on each shortened URL
- **IP Tracking**: Capture IP addresses of visitors
- **Device Information**: Track device type, browser, and OS details
- **Geographic Tracking**: Get precise location data including:
  - Latitude and longitude coordinates
  - Country, region, and city information
  - Powered by Google Maps API
- **User Authentication**: Secure sign-up and sign-in functionality
- **Visit History**: View detailed history of all clicks with timestamps
- **Interactive Map**: Visual representation of visitor locations

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Redux Toolkit** - State management
- **CSS3** - Styling
- **React Router** - Navigation

### Backend & Database
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM (Object Document Mapper)

### External Services
- **Google Maps API** - Location tracking and mapping
- **Geolocation services** - IP-based location detection

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Ankitbhagat2062/ShortURL.git
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Start the development server
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## 📱 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🎯 Usage

1. **Sign Up/Sign In**: Create an account or log in to access the dashboard
2. **Create Short URL**: Enter a long URL and get a shortened version
3. **Share Your Link**: Use the short URL anywhere
4. **Track Analytics**: View detailed analytics for each URL including:
   - Total clicks
   - Visitor locations on interactive map
   - Device and browser information
   - Timestamps of each visit

## 📊 Analytics Dashboard

The application provides comprehensive analytics including:
- **Real-time click tracking**
- **Interactive map showing visitor locations**
- **Device breakdown (Desktop, Mobile, Tablet)**
- **Browser statistics**
- **Geographic distribution of visitors**

## 🔧 Project Structure

```
src/
├── Components/
│   ├── Home.js           # Landing page
│   ├── Signin.js         # User authentication
│   ├── Signup.js         # User registration
│   ├── AllURL.js         # URL management
│   ├── VisitHistory.js   # Analytics dashboard
│   ├── MyMapComponent.js # Interactive map
│   └── Navbar.js         # Navigation component
├── features/
│   └── User/
│       └── UserSlice.js  # Redux user state
├── app/
│   └── store.js          # Redux store configuration
└── App.js               # Main application component
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact & Social Media

Connect with me on various platforms:

| Social Media | UserName | Profile |
|----------|-------------|----------|
|[![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://facebook.com/ankit.bhagat.865533)|ankit.bhagat.865533| [Ankit Bhagat](https://facebook.com/ankit.bhagat.865533) |
|[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/AnkitBhaga53031)|AnkitBhaga53031 |[Ankit Bhagat](https://twitter.com/AnkitBhaga53031) | 
|[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@ankitbhagat2064)|@ankitbhagat2064 | [Ankit Bhagat](https://youtube.com/@ankitbhagat2064)|
|[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/ankitbhagat56547)| ankitbhagat56547| [Ankit Bhagat](https://instagram.com/ankitbhagat56547)|
|[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?)](https://linkedin.com/in/ankit-bhagat-8483a0313)| ankit-bhagat-8483a0313| [Ankit Bhagat](https://linkedin.com/in/ankit-bhagat-8483a0313)|

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with Create React App
- Location services powered by Google Maps API
- Icons and graphics from various open-source libraries

---

Made with ❤️ by Ankit Bhagat
