
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  // Create a truncated version of content for preview
  const preview = post.content.substring(0, 120) + (post.content.length > 120 ? '...' : '');
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-200">
      <div className="p-5">
        <div className="flex items-center mb-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {post.category || 'General'}
          </span>
          <span className="text-gray-500 text-sm ml-2">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <Link to={`/post/${post._id}`}>
          <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition mb-2">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-4">{preview}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-700 text-sm">
            By <span className="font-medium">{post.author.username}</span>
          </span>
          
          <Link 
            to={`/post/${post._id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;