import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePostStore, useAuthStore } from "@/store/store"; // Added useAuthStore import

export default function EditPost() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getPostById, updatePost, loading, error } = usePostStore();
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    image: File | null | string;
  }>({
    title: "",
    content: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        const postData = await getPostById(id);
        if (postData) {
          setFormData({
            title: postData.title,
            content: postData.content,
            image: postData.image || null,
          });
          setPreviewImage(postData.image || null);
        } else {
          console.error("Post not found");
          // navigate("/dashboard", { replace: true });
          // alert("Post not found.");
        }
      }
    };

    fetchPost();
  }, [getPostById, id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPEG, PNG, and JPG formats are allowed!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB!");
        return;
      }
      setFormData((prev) => ({ ...prev, image: file })); // Store the File object in formData
      setPreviewImage(URL.createObjectURL(file)); // Create a URL for preview
    } else {
      // If user cancels, revert the preview to the previously shown URL
      // formData.image will retain the File object (if selected) or the string URL
      setPreviewImage(previewImage); // Keep the current preview
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      alert("Post ID is missing.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    const tokenFromStore = useAuthStore.getState().token; // Get token directly here
    console.log("Token in EditPost before updatePost:", tokenFromStore);

    try {
      await updatePost(id, data);
      navigate(`/view/${id}`);
    } catch (error) {
      alert("Failed to update post. Please try again.");
      console.error("Error updating post:", error);
    }
  };

  if (loading) {
    return <div>Loading post data...</div>;
  }

  if (error) {
    return <div>Error loading post: {error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-4xl mx-auto mt-10 p-4">
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="image">Upload New Image (Optional)</Label>
              <Input
                id="image"
                type="file"
                accept="image/jpeg, image/png, image/jpg"
                onChange={handleFileChange}
              />
              {previewImage && (
                <div className="mt-2">
                  <Label>New Image Preview:</Label>
                  <img src={previewImage} alt="Post Preview" className="max-h-40 rounded-md" />
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Updating..." : "Update Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}