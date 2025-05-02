// client/src/pages/PostDetails.jsx
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    Promise.all([
      axios.get(`/posts/${id}`),
      axios.get(`/comments/${id}`)
    ]).then(([postRes, commentsRes]) => {
      setPost(postRes.data);
      setComments(commentsRes.data);
      
      if (token) {
        const userId = JSON.parse(atob(token.split('.')[1])).id;
        setLiked(postRes.data.likes && postRes.data.likes.includes(userId));
      }
      
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      await axios.post(`/comments/${id}`, { content: newComment });
      const res = await axios.get(`/comments/${id}`);
      setComments(res.data);
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLike = async () => {
    if (!isLoggedIn) return;
    
    const endpoint = liked ? 'unlike' : 'like';
    try {
      const res = await axios.post(`/posts/${endpoint}/${id}`);
      setPost(res.data);
      setLiked(!liked);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto py-20 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Post not found</h1>
          <Link to="/" className="text-blue-600 hover:underline">Return to homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <article className="max-w-4xl mx-auto bg-white my-8 rounded-lg shadow-md overflow-hidden">
        <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8">
          <div className="inline-block bg-white bg-opacity-25 px-3 py-1 rounded-full text-sm mb-4">
            {post.category || 'General'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{post.title}</h1>
          <div className="flex items-center mt-4">
            <div className="bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-gray-700 font-semibold">
              {post.author.username.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="font-medium">{post.author.username}</p>
              <p className="text-sm opacity-90">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </header>
        
        <div className="p-8">
          <div className="prose max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              paragraph ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
            ))}
          </div>
          
          <div className="mt-8 flex items-center gap-4">
            <button 
              onClick={toggleLike} 
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                liked 
                  ? 'bg-red-100 text-red-600 border border-red-200' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              } ${isLoggedIn ? 'hover:bg-opacity-80' : 'opacity-70 cursor-not-allowed'}`}
              disabled={!isLoggedIn}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {post.likes ? post.likes.length : 0} {post.likes && post.likes.length === 1 ? 'Like' : 'Likes'}
            </button>
            
            <div className="text-gray-500 text-sm">
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </div>
          </div>
        </div>
        
        <section className="p-8 border-t border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold mb-6">Comments</h2>
          
          {isLoggedIn ? (
            <form onSubmit={handleComment} className="mb-8">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Share your thoughts..."
              />
              <button 
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Post Comment
              </button>
            </form>
          ) : (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8">
              <p className="text-blue-800">
                <Link to="/login" className="font-bold hover:underline">Sign in</Link> to leave a comment.
              </p>
            </div>
          )}
          
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map(c => (
                <div key={c._id} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-gray-700 font-semibold">
                      {c.author.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="ml-2 font-medium">{c.author.username}</span>
                    <span className="ml-2 text-gray-500 text-sm">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{c.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>
        </section>
      </article>
    </div>
  );
};

export default PostDetails;