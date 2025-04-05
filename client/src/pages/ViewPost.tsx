
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { type Post, usePostStore, useAuthStore } from "@/store/store"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, User, Calendar } from "lucide-react"

export default function ViewPost() {
  const { id: postIdParam } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { posts, loading, error, getPostById, deletePost } = usePostStore()
  const { user } = useAuthStore()
  const [currentPost, setCurrentPost] = useState<Post | null>(null)

  useEffect(() => {
    if (postIdParam) {
      const id = postIdParam
      const existingPost = posts.find((post) => post.id === id)
      if (existingPost) {
        setCurrentPost(existingPost)
      } else {
        getPostById(id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postIdParam, getPostById, posts])

  useEffect(() => {
    if (posts && postIdParam) {
      setCurrentPost(posts.find((post) => post.id === postIdParam) || null)
    }
  }, [posts, postIdParam])

  const handleDelete = async () => {
    if (currentPost?.id) {
      await deletePost(currentPost.id)
      navigate("/")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-16 flex justify-center items-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-gray-800 animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading post...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto py-16 flex justify-center"
      >
        <Card className="w-full max-w-2xl border-red-200 bg-red-50 dark:bg-red-900/10">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 dark:text-red-400">Error: {error}</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (!currentPost) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto py-16 flex justify-center"
      >
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">Post not found.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const isAuthor = user && currentPost?.authorId === user.id

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto py-8 px-4 max-w-5xl"
    >
      <Card className="overflow-hidden border-none shadow-lg ">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div>
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <CardTitle className="text-3xl font-bold tracking-tight">{currentPost.title}</CardTitle>
                <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
<User size={20}/>
                    </div>
                    <span>{currentPost.author?.username || "Unknown"}</span>
                  </div>
                  <div className="flex items-center ml-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Posted on {currentPost.createdAt ? formatDate(currentPost.createdAt) : "No date"}</span>
                  </div>
                </div>
              </motion.div>
            </div>
            {isAuthor && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-x-2"
              >
                <Link to={`/edit/${currentPost.id}`}>
                  <Button variant="outline" className="group hover:scale-105">
                    <Edit className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                    Edit
                  </Button>
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                  <Button variant="destructive" onClick={handleDelete} className="group">
                    <Trash2 className="w-4 h-4 mr-2 group-hover:text-white transition-colors" />
                    Delete
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {currentPost.imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative w-full rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={currentPost.imageUrl || "/placeholder.svg"}
                alt={currentPost.title}
                className="w-full sm:h-[500px] h-[200px] object-cover"
              />
            </motion.div>
          )}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">
              {currentPost.content}
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="pt-4">
            <Button variant="outline" onClick={() => navigate("/dashboard")} className="group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

