import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface AuthState {
    user: any | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    checkUserSession: () => Promise<void>;
    signupUser: (userData: any) => Promise<void>;
    loginUser: (userData: any) => Promise<void>;
    logout: () => void;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    image: string | null;
    author?: { username: string };
    // ... other post properties
    [key: string]: any; // To allow other potential properties
  }

interface PostState {
    posts: Post[];
    loading: boolean;
    error: string | null;
    allPostsFetched: boolean;
    currentPage: number;
    postsPerPage: number;
    searchQuery: string;
    createPost: (postData: any) => Promise<void>;
    getAllPosts: () => Promise<void>;
    getPostById: (id: string) => Promise<Post | undefined>;
    updatePost: (id: string, postData: any) => Promise<void>;
    deletePost: (id: string) => Promise<void>;
    setPage: (page: number) => void;
    setPostsPerPage: (limit: number) => void;
    setSearchQuery: (query: string) => void;
    getDisplayedPosts: () => Post[];
    getTotalFilteredPosts: () => number;
    getTotalPages: () => number;
}

export const useAuthStore = create<AuthState>((set, get)=>({
    user: null,
    token: null,
    loading: false,
    error: null,

    checkUserSession: async () =>{
        set({ loading: true });
        const token = get().token || localStorage.getItem("token");
        if (!token) {
            set({ user: null, token: null, loading: false }); // Set loading to false
            return;
          }
        try {
            const response = await axios.get(`${BASE_URL}/auth/user`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set({ user: response.data,loading:false});
        } catch (error:any) {
            console.error("Session check failed:", error);
            set({ user: null, token: null , loading: false, error: error.message });
            localStorage.removeItem("token");
        }
    },

    signupUser: async (userData) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${BASE_URL}/auth/register`, userData);
            set(()=>({
                user: response.data.user, 
                token: response.data.token, 
                loading: false
            }))
            localStorage.setItem("token", response.data.token);
        } catch (error:any) {
            console.error("Signup failed:", error);
            set({ loading: false, error: error.message });
        }
    },

    loginUser: async (userData) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${BASE_URL}/auth/login`, userData);
            set(()=>({
                user: response.data.user, 
                token: response.data.token, 
                loading: false
            }))
            localStorage.setItem("token", response.data.token);
        } catch (error:any) {
            console.error("Login failed:", error);
            set({ loading: false, error: error.message });
        }
    },

    logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem("token");
    }
}))

export const usePostStore = create<PostState>((set,get)=>({
    posts: [],
    loading: false,
    error: null,
    allPostsFetched: false,
    currentPage: 1,
    postsPerPage: 10,
    searchQuery: '',

    createPost: async (postData) => {
        try {
            set({ loading: true });
    
            const token = localStorage.getItem("token");
    
            const response = await axios.post(`${BASE_URL}/posts`, postData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
    
            set((state) => ({
                posts: [...state.posts, response.data],
                loading: false,
            }));
        } catch (error: any) {
            console.error("Create post failed:", error);
            set({ loading: false, error: error.message });
        }
    },
    

    getAllPosts: async () => {
        try {
            set({loading: true});
            const response = await axios.get(`${BASE_URL}/posts`);
            set({posts: response.data, loading: false});
        } catch (error:any) {
            console.error("Fetch posts failed:", error);
            set({ loading: false, error: error.message });
        }
    },

    getPostById: async (id: string) => {
      try {
        set({ loading: true, error: null }); // Reset error on new request
        const response = await axios.get<Post>(`${BASE_URL}/posts/${id}`);
        set((state) => ({
          posts: state.posts.some(post => post.id === id)
            ? state.posts.map(post => (post.id === id ? response.data : post)) // Update if exists
            : [...state.posts, response.data], // Add if new
          loading: false,
        }));
        return response.data;
      } catch (error: any) {
        console.error("Fetch post failed:", error);
        set({ loading: false, error: error.message });
        return undefined;
      }
    },

    updatePost: async (id, postData) => {
        try {
            set({ loading: true });
            const token = localStorage.getItem("token");
            const response = await axios.put(`${BASE_URL}/posts/${id}`, postData, {
              headers: { 
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
            },
            });
            set((state) => ({
              posts: state.posts.map((post) => (post.id === id ? response.data : post)),
              loading: false,
            }));
          } catch (error: any) {
            console.error("Update post failed:", error);
            set({ loading: false, error: error.message });
          }
    },

    deletePost: async (id) => {
        try {
            set({ loading: true });
            const token = localStorage.getItem("token");
            await axios.delete(`${BASE_URL}/posts/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            set((state) => ({ posts: state.posts.filter((post) => post.id !== id), loading: false }));
          } catch (error: any) {
            console.error("Delete post failed:", error);
            set({ loading: false, error: error.message });
          }
    },
    
    setPage: (page) => {
        set({ currentPage: page });
      },
    
      setPostsPerPage: (limit) => {
        set({ postsPerPage: limit, currentPage: 1 });
      },
    
      setSearchQuery: (query) => {
        set({ searchQuery: query, currentPage: 1 });
      },
    
      getDisplayedPosts: () => {
        const allPosts = get().posts;
        const currentPage = get().currentPage;
        const postsPerPage = get().postsPerPage;
        const searchQuery = get().searchQuery.toLowerCase();
    
        const filteredPosts = allPosts.filter((post) => (
          post.title.toLowerCase().includes(searchQuery) ||
          post.content.toLowerCase().includes(searchQuery) ||
          post.author?.username?.toLowerCase().includes(searchQuery)
        ));
    
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
      },
    
      getTotalFilteredPosts: () => {
        const allPosts = get().posts;
        const searchQuery = get().searchQuery.toLowerCase();
        return allPosts.filter((post) => (
          post.title.toLowerCase().includes(searchQuery) ||
          post.content.toLowerCase().includes(searchQuery) ||
          post.author?.username?.toLowerCase().includes(searchQuery)
        )).length;
      },
    
      getTotalPages: () => {
        const totalFilteredPosts = get().getTotalFilteredPosts();
        const postsPerPage = get().postsPerPage;
        return Math.ceil(totalFilteredPosts / postsPerPage);
      },
}))