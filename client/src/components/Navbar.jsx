import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="font-bold text-xl">TechBlog</Link>
          
          <div className="flex space-x-4 items-center">
            <Link to="/" className="hover:text-blue-200 transition">Home</Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/create" className="hover:text-blue-200 transition">New Post</Link>
                <Link to="/profile" className="hover:text-blue-200 transition">Profile</Link>
                <button 
                  onClick={handleLogout}
                  className="bg-white text-blue-600 px-3 py-1 rounded-md hover:bg-blue-50 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="hover:text-blue-200 transition"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 px-3 py-1 rounded-md hover:bg-blue-50 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;