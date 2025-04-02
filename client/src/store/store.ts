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

interface PostState {
    posts: any[];
    loading: boolean;
    error: string | null;
    createPost: (postData: any) => Promise<void>;
    getAllPosts: () => Promise<void>;
    getPostById: (id: string) => Promise<void>;
    updatePost: (id: string, postData: any) => Promise<void>;
    deletePost: (id: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get)=>({
    user: null,
    token: null,
    loading: false,
    error: null,

    checkUserSession: async () =>{
        const token = get().token || localStorage.getItem("token");
        if(!token) return;
        try {
            const response = await axios.get(`${BASE_URL}/auth/me`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set({ user: response.data});
        } catch (error:any) {
            console.error("Session check failed:", error);
            set({ user: null, token: null });
            localStorage.removeItem("token");
        }
    },

    signupUser: async (userData) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${BASE_URL}/auth/register`, userData);
            set({user: response.data.user, token: response.data.token ,loading: false });
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
            set({ user: response.data.user, token: response.data.token, loading: false });
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

    createPost: async (postData) => {
        try {
            set({ loading: true });
            const token = useAuthStore.getState().token;
            const response = await axios.post(`${BASE_URL}/api/posts`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set((state)=>({
                posts: [...state.posts, response.data],
                loading: false
            }))
        } catch (error:any) {
            console.error("Create post failed:", error);
            set({ loading: false, error: error.message });
        }
    },

    getAllPosts: async () => {
        try {
            set({loading: true});
            const response = await axios.get(`${BASE_URL}/api/posts`);
            set({posts: response.data, loading: false});
        } catch (error:any) {
            console.error("Fetch posts failed:", error);
            set({ loading: false, error: error.message });
        }
    },

    getPostById: async (id) => {
        try {
            set({ loading: true });
            const response = await axios.get(`${BASE_URL}/api/posts/${id}`);
            set({ loading: false });
            return response.data;
          } catch (error: any) {
            console.error("Fetch post failed:", error);
            set({ loading: false, error: error.message });
          }
    },

    updatePost: async (id, postData) => {
        try {
            set({ loading: true });
            const token = useAuthStore.getState().token;
            const response = await axios.put(`${BASE_URL}/api/posts/${id}`, postData, {
              headers: { Authorization: `Bearer ${token}` },
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
            const token = useAuthStore.getState().token;
            await axios.delete(`${BASE_URL}/api/posts/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            set((state) => ({ posts: state.posts.filter((post) => post.id !== id), loading: false }));
          } catch (error: any) {
            console.error("Delete post failed:", error);
            set({ loading: false, error: error.message });
          }
    }
}))