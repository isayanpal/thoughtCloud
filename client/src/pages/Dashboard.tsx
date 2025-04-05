import type React from "react"
import { useEffect } from "react"
import { usePostStore } from "@/store/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Search, Loader2, AlertCircle, Calendar, User, Eye, Plus } from "lucide-react"


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
  } = usePostStore()

  useEffect(() => {
    getAllPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const displayedPosts = getDisplayedPosts()
  const totalPages = getTotalPages()

  const handlePageChange = (page: number) => {
    setPage(page)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handlePostsPerPageChange = (value: string) => {
    setPostsPerPage(Number.parseInt(value))
  }

  // Function to format date (assuming posts have a date field)
  const formatDate = (dateString: string) => {
    if (!dateString) return "No date"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Read the latest blogs</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and browse all blog posts</p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search posts by title or content..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 whitespace-nowrap">Show:</span>
              <Select value={postsPerPage.toString()} onValueChange={handlePostsPerPageChange}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 posts</SelectItem>
                  <SelectItem value="10">10 posts</SelectItem>
                  <SelectItem value="20">20 posts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="mt-4 text-gray-500">Loading your posts...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 flex items-center gap-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <div>
              <h3 className="font-medium text-red-800 dark:text-red-300">Error loading posts</h3>
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Posts grid */}
        {!loading && !error && (
          <>
            {displayedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden transition-all hover:shadow-md border-black/5">

                      {post.imageUrl && (
                        <div className="h-48 w-full overflow-hidden">
                          <img
                            src={post.imageUrl || "/placeholder.svg"}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="line-clamp-2 py-3">{post.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          {post.author?.username || "Unknown author"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {post.content.substring(0, 150)}
                          {post.content.length > 150 && "..."}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center text-xs text-gray-500 pt-0">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{post.createdAt ? formatDate(post.createdAt) : "No date"}</span>
                        </div>
                    <Link to={`/view/${post.id}`} className="block h-full ">
                        <Button className="flex items-center gap-1 cursor-pointer">
                          <Eye className="h-3 w-3" />
                          <span>Read</span>
                        </Button>
                        </Link>
                      </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
                <div className="flex flex-col items-center">
                  <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No posts found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    {searchQuery
                      ? `No posts match your search for "${searchQuery}". Try a different search term.`
                      : "You haven't created any posts yet. Start by creating your first post."}
                  </p>
                  {!searchQuery && (
                    <Button asChild>
                      <Link to="/create">
                        <Plus className="h-4 w-4 mr-2" /> Create Your First Post
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{(currentPage - 1) * postsPerPage + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(currentPage * postsPerPage, posts.length)}</span> of{" "}
                  <span className="font-medium">{posts.length}</span> posts
                </div>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => {
                      // Show first page, last page, and pages around current page
                      const pageNum = i + 1
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              isActive={pageNum === currentPage}
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                        return (
                          <PaginationItem key={pageNum}>
                            <span className="flex h-9 w-9 items-center justify-center text-sm">...</span>
                          </PaginationItem>
                        )
                      }
                      return null
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

