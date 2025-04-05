import { Button } from "@/components/ui/button"
import { Plus, Eye, Pencil, Trash } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function Home() {
  const token = localStorage.getItem("token")

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const featureCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  const buttonHoverVariants = {
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.95 },
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="text-4xl md:text-6xl font-bold tracking-tight" variants={itemVariants}>
            Share your thoughts with the world
          </motion.h1>
          <motion.p className="text-lg text-gray-600 max-w-2xl mx-auto" variants={itemVariants}>
            A minimal blogging platform designed for writers who appreciate simplicity and elegance. Create, update, and
            share your ideas with our easy-to-use interface.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-3 justify-center pt-4" variants={itemVariants}>
            <Link to={token ? "/write" : "/auth"}>
              <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
                <Button className="gap-2">
                  Get Started <Plus className="h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
            <Link to={"/dashboard"}>
              <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
                <Button variant="outline" className="gap-2">
                  Browse Articles <Eye className="h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Website Features */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Plus className="h-6 w-6" />,
                title: "Create",
                description: "Write and publish your stories effortlessly.",
                bgColor: "bg-blue-100",
                textColor: "text-blue-500",
              },
              {
                icon: <Pencil className="h-6 w-6" />,
                title: "Update",
                description: "Easily edit and refine your existing content.",
                bgColor: "bg-green-100",
                textColor: "text-green-500",
              },
              {
                icon: <Trash className="h-6 w-6" />,
                title: "Delete",
                description: "Remove posts you no longer need with ease.",
                bgColor: "bg-red-100",
                textColor: "text-red-500",
              },
              {
                icon: <Eye className="h-6 w-6" />,
                title: "View",
                description: "Enjoy a clean and simple reading experience.",
                bgColor: "bg-yellow-100",
                textColor: "text-yellow-500",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="flex flex-col items-center space-y-2 shadow-md p-4 rounded-lg"
                custom={i}
                variants={featureCardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className={`rounded-md ${feature.bgColor} ${feature.textColor} p-3`}
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          className="max-w-3xl mx-auto bg-gray-50 p-8 md:p-12 rounded-xl text-center space-y-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            type: "spring",
            stiffness: 50,
            duration: 0.8,
          }}
        >
          <motion.h2
            className="text-3xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Ready to start writing?
          </motion.h2>
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Join our community of writers and share your knowledge with the world. Create your first blog post today.
          </motion.p>
          <Link to={token ? "/write" : "/auth"}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button size="lg" className="gap-2">
                Create New Post <Plus className="h-4 w-4" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </section>
    </motion.div>
  )
}

