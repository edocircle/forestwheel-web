import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TopNavBar from './components/TopNavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Inventory from './pages/Inventory'
import SellCar from './pages/SellCar'
import AboutUs from './pages/AboutUs'
import CarDetails from './pages/CarDetails'
function App() {
  return (
    <Router>
      <TopNavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/:id" element={<CarDetails />} />
        <Route path="/sell" element={<SellCar />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
