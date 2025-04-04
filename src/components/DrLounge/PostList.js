import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import PostCard from './PostCard';

const POSTS_PER_PAGE = 10;

const PostList = ({ selectedCategory, onShowSignupPrompt }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const observer = useRef();

  // Reset page when category changes
  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
  }, [selectedCategory]);

  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const from = page * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      // Get current user for like status
      const { data: { user } } = await supabase.auth.getUser();

      // Build query
      let query = supabase
        .from('posts')
        .select(`
          *,
          users:user_id (username, specialty),
          likes:likes(user_id),
          comments:comments(count)
        `)
        .order('created_at', { ascending: false });

      // Add category filter if selected
      if (selectedCategory && selectedCategory !== 'All Posts') {
        query = query.eq('category', selectedCategory);
      }

      // Add pagination
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) throw error;

      const formattedPosts = data.map(post => ({
        ...post,
        authorUsername: post.users.username,
        authorSpecialty: post.users.specialty,
        likes: post.likes.length,
        comments: post.comments[0]?.count || 0,
        isLikedByUser: user ? post.likes.some(like => like.user_id === user.id) : false
      }));

      setPosts(prevPosts => {
        if (page === 0) return formattedPosts;
        return [...prevPosts, ...formattedPosts];
      });
      setHasMore(data.length === POSTS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, selectedCategory]);

  return (
    <div className="max-w-2xl mx-auto py-6">
      {posts.map((post, index) => {
        if (posts.length === index + 1) {
          return (
            <div ref={lastPostElementRef} key={post.id}>
              <PostCard 
                post={post} 
                onShowSignupPrompt={onShowSignupPrompt}
              />
            </div>
          );
        } else {
          return (
            <PostCard 
              key={post.id} 
              post={post}
              onShowSignupPrompt={onShowSignupPrompt}
            />
          );
        }
      })}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <p className="text-center text-gray-500 py-4">No more posts to load</p>
      )}
      {!loading && posts.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          {selectedCategory === 'All Posts' 
            ? 'No posts yet' 
            : `No posts in ${selectedCategory} category`}
        </p>
      )}
    </div>
  );
};

export default PostList; 