import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Users from './Components/Users';
import Feed from './Components/Feed';
import Profile from './Components/Profile';
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import { useSelector } from "react-redux";


function App() {
  const isLoggedIn = useSelector((state) => state.features.isLoggedIn);
  return (
    
    <Router>
      {
        isLoggedIn ? (<Navbar/>):(<></>)
      }
  <Routes>
    <Route path="/users" element={
        isLoggedIn ? (<Users/>):(<><Navbar/><Users/></>)
      } />
    <Route path="/feed" element={<><Feed /></>} />
    <Route path="/profile" element={<><Profile /></>} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route
          path="/"
          element={
            !isLoggedIn ? (
              <Login/>
            ) : (
              <><Profile/></>
            )
          }
        />
  </Routes>
</Router>

  );
}

export default App;
