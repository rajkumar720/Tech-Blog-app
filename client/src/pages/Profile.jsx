// client/src/pages/Profile.jsx
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ posts: 0, likes: 0, comments: 0 });
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const userId = JSON.parse(atob(token.split('.')[1])).id;
      
      // Fetch user data and posts in parallel
      const [userRes, postsRes] = await Promise.all([
        axios.get('/users/me'),
        axios.get(`/users/${userId}/posts`)
      ]);
      
      setUser(userRes.data);
      setPosts(postsRes.data);
      
      // Calculate stats
      const totalLikes = postsRes.data.reduce(
        (sum, post) => sum + (post.likes?.length || 0), 
        0
      );
      
      setStats({
        posts: postsRes.data.length,
        likes: totalLikes,
        comments: 0 // You could fetch this if you have an endpoint for it
      });
      
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);
    
    try {
      await axios.delete(`/posts/${postId}`);
      
      // Update local state after successful deletion
      setPosts(posts.filter(post => post._id !== postId));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        posts: prev.posts - 1,
        likes: prev.likes - (posts.find(p => p._id === postId)?.likes?.length || 0)
      }));
      
    } catch (error) {
      console.error("Error deleting post:", error);
      setDeleteError("Failed to delete post. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-20 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile not found</h1>
          <Link to="/login" className="text-blue-600 hover:underline">Please login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
          <div className="px-6 py-8 relative">
            <div className="absolute -top-12 left-6 bg-white rounded-full p-1 shadow-lg">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
            
            <div className="ml-24 pt-2">
              <h1 className="text-2xl font-bold text-gray-800">{user.username}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-start space-x-8">
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-800">{stats.posts}</span>
                <span className="text-gray-600 text-sm">Posts</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-800">{stats.likes}</span>
                <span className="text-gray-600 text-sm">Likes</span>
              </div>
            </div>
          </div>
        </div>
        
        {deleteError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {deleteError}
          </div>
        )}
        
        {/* Posts Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">My Posts</h2>
            <Link 
              to="/create" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Create New Post
            </Link>
          </div>
          
          <div className="divide-y divide-gray-200">
            {posts.length > 0 ? (
              posts.map(post => (
                <div key={post._id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start">
                    <Link to={`/post/${post._id}`} className="flex-1">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition mb-1">
                          {post.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                            {post.category || 'General'}
                          </span>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-gray-600 line-clamp-2">
                          {post.content.substring(0, 100)}
                          {post.content.length > 100 ? '...' : ''}
                        </p>
                      </div>
                    </Link>
                    
                    <div className="flex items-center space-x-4 ml-4">
                      <div className="flex items-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span className="ml-1">{post.likes?.length || 0}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeletePost(post._id);
                          }}
                          disabled={deleteLoading}
                          className="text-red-500 hover:text-red-700 focus:outline-none transition"
                          title="Delete post"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p className="mb-4">You haven't created any posts yet.</p>
                <Link to="/create" className="text-blue-600 hover:underline">
                  Create your first post
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;