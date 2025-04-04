import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '../../supabaseClient';

const PostCard = ({ post, onShowSignupPrompt }) => {
  const [isLiked, setIsLiked] = useState(post.isLikedByUser);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleLike = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data?.user) {
        onShowSignupPrompt();
        return;
      }

      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.data.user.id);
      } else {
        await supabase
          .from('likes')
          .insert([{
            post_id: post.id,
            user_id: user.data.user.id,
            created_at: new Date().toISOString()
          }]);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          users:user_id (username, specialty)
        `)
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data.map(comment => ({
        ...comment,
        authorUsername: comment.users.username,
        authorSpecialty: comment.users.specialty
      })));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    try {
      const user = await supabase.auth.getUser();
      if (!user.data?.user) {
        onShowSignupPrompt();
        return;
      }

      setIsSubmitting(true);
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          post_id: post.id,
          user_id: user.data.user.id,
          content: newComment,
          created_at: new Date().toISOString()
        }])
        .select(`
          *,
          users:user_id (username, specialty)
        `)
        .single();

      if (error) throw error;

      setComments(prev => [...prev, {
        ...data,
        authorUsername: data.users.username,
        authorSpecialty: data.users.specialty
      }]);
      setNewComment('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleComments = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-600">{post.category}</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {post.authorSpecialty} • {post.authorUsername}
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
        <p className="text-gray-700">{post.content}</p>
      </div>

      {/* Post Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-6">
          <button 
            className={`flex items-center gap-1 hover:text-gray-700 ${isLiked ? 'text-blue-600' : ''}`}
            onClick={handleLike}
          >
            <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{likesCount}</span>
          </button>
          <button 
            className="flex items-center gap-1 hover:text-gray-700"
            onClick={toggleComments}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{comments.length || post.comments}</span>
          </button>
        </div>
        <div className="flex items-center">
          <span>{post.views} views</span>
          <button className="ml-4 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t">
          {comments.map((comment) => (
            <div key={comment.id} className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{comment.authorUsername}</span>
                <span className="text-gray-500 text-sm">•</span>
                <span className="text-gray-500 text-xs">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{comment.content}</p>
            </div>
          ))}

          <div className="mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleComment}
                disabled={isSubmitting || !newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-red-600 text-sm">{error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard; 