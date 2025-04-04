import React, { useEffect } from "react";
import { usePostStore } from "@/store/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Post } from "@/store/store";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const {
    posts,
    loading,
    error,
    allPostsFetched,
    currentPage,
    postsPerPage,
    searchQuery,
    getAllPosts,
    setPage,
    setPostsPerPage,
    setSearchQuery,
    getDisplayedPosts,
    getTotalPages,
  } = usePostStore();

  useEffect(() => {
      getAllPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayedPosts = getDisplayedPosts();
  const totalPages = getTotalPages();

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handlePostsPerPageChange = (value: string) => {
    setPostsPerPage(parseInt(value));
  };

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error loading posts: {error}</div>;
  }

  return (
    <div className="min-h-screen p-4">
      <h1>Dashboard</h1>

      <Input
        type="text"
        placeholder="Search posts..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="mb-4"
      />

      {displayedPosts.length > 0 ? (
        <div className="space-y-4">
          {displayedPosts.map((post) => (
            <Link to={`/view/${post.id}`} key={post.id}>
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    Author: {post.author?.username || "Unknown"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-start gap-4">
                  {post.imageUrl && (
                    <div className="h-16 w-16 rounded-md overflow-hidden shadow-sm">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {post.content.substring(0, 100)}...
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p>No posts found.</p>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-4 flex justify-center">
          <PaginationPrevious
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            className={
              currentPage === 1 ? "opacity-50 pointer-events-none" : ""
            }
          />
          <PaginationContent>
            {/* Generate page links */}
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  isActive={i + 1 === currentPage}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && handlePageChange(currentPage + 1)
            }
            className={
              currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
            }
          />
        </Pagination>
      )}

      <div className="mt-4">
        <label
          htmlFor="postsPerPage"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Items per page:
        </label>
        <Select
          value={postsPerPage.toString()}
          onValueChange={handlePostsPerPageChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
