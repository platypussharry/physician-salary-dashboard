import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

const CATEGORIES = [
  'Compensation',
  'Career Advice',
  'Job Market',
  'Contract Review',
  'Clinical Practice',
  'Work-Life Balance',
];

const CreatePost = ({ onClose, editPost = null }) => {
  const [title, setTitle] = useState(editPost?.title || '');
  const [content, setContent] = useState(editPost?.content || '');
  const [category, setCategory] = useState(editPost?.category || CATEGORIES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const user = await supabase.auth.getUser();
      if (!user.data?.user) throw new Error('Not authenticated');

      const postData = {
        title,
        content,
        category,
        user_id: user.data.user.id,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (editPost) {
        result = await supabase
          .from('posts')
          .update(postData)
          .eq('id', editPost.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('posts')
          .insert([{ ...postData, created_at: new Date().toISOString() }])
          .select()
          .single();
      }

      if (result.error) throw result.error;
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {editPost ? 'Edit Post' : 'Create New Post'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[200px]"
              required
            />
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : editPost ? 'Save Changes' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost; 