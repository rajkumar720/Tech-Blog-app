// client/src/pages/Home.jsx
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    setLoading(true);
    axios.get('/posts').then((res) => {
      setPosts(res.data);

      // Extract unique categories
      const uniqueCategories = [...new Set(res.data.map(post => post.category))].filter(Boolean);
      setCategories(uniqueCategories);

      setLoading(false);
    });
  }, []);

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">TechBlog</h1>
          <p className="text-xl opacity-90">The latest insights from the tech world</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium 
              ${selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            All Posts
          </button>

          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium 
                ${selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading posts...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <PostCard key={post._id} post={post} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">
                No posts found in this category.
              </p>
            )}
          </div>
        )}
      </main>

      <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} TechBlog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;