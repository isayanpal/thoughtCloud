import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore, usePostStore } from "@/store/store";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
    const navigate = useNavigate();
  const { createPost, loading } = usePostStore();
  const { user } = useAuthStore();
  const userId = user?.id;
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    image: File | null;
  }>({
    title: "",
    content: "",
    image: null,
  });

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
    }
    setFormData((prev) => ({ ...prev, image: file }));
};


const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
        alert("User not found. Please login again.");
        return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    if (formData.image) data.append("image", formData.image);
    data.append("authorId", String(userId));
    
    try {
        await createPost(data);
        navigate("/dashboard");
        setFormData({ title: "", content: "", image: null });
    } catch (error) {
        alert("Failed to create post. Please try again.");
        console.error("Error creating post:", error);
    }
};


  return (
<div className="min-h-screen flex items-center justify-center">
<Card className="max-w-md mx-auto mt-10 p-4">
      <CardHeader>
        <CardTitle>Create a New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="image">Upload Image</Label>
            <Input id="image" type="file" accept="image/jpeg, image/png, image/jpg" onChange={handleFileChange} />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
</div>
  );
}
