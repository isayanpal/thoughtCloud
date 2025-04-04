import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Post, usePostStore, useAuthStore } from '@/store/store';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'; // Assuming you are using React Router

export default function ViewPost() {
  const { id: postIdParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts, loading, error, getPostById, deletePost } = usePostStore();
  const { user } = useAuthStore();
  const [currentPost, setCurrentPost] = useState<Post | null>(null);

  useEffect(() => {
    if (postIdParam) {
      const id = postIdParam;
      const existingPost = posts.find((post) => post.id === id);
      if (existingPost) {
        setCurrentPost(existingPost);
      } else {
        getPostById(id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postIdParam, getPostById, posts]);

  useEffect(() => {
    if (posts && postIdParam) {
      setCurrentPost(posts.find((post) => post.id === postIdParam) || null);
    }
  }, [posts, postIdParam]);

  const handleDelete = async () => {
    if (currentPost?.id) {
      await deletePost(currentPost.id);
      navigate('/');
    }
  };

  if (loading) {
    return <div>Loading post...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentPost) {
    return <div>Post not found.</div>;
  }

  const isAuthor = user && currentPost?.authorId === user.id;

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">{currentPost.title}</CardTitle>
              <CardDescription>Author: {currentPost.author?.username || 'Unknown'}</CardDescription>
            </div>
            {isAuthor && (
              <div className="space-x-2">
                <Link to={`/edit/${currentPost.id}`}>
                  <Button>Edit</Button>
                </Link>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentPost.imageUrl && (
            <div className="relative w-full rounded-md overflow-hidden shadow-sm">
              <img
                src={currentPost.imageUrl}
                alt={currentPost.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          <p className="text-gray-700 dark:text-gray-300">{currentPost.content}</p>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}