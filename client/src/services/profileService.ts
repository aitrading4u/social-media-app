import api from './api';

export interface UserProfile {
  _id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  coverPhoto?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate: Date;
  followers: number;
  following: number;
  posts: number;
  isVerified: boolean;
  isPrivate: boolean;
  isFollowing?: boolean;
}

export interface Post {
  _id: string;
  author: {
    _id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  };
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileStats {
  posts: number;
  followers: number;
  following: number;
}

// Mock data for demo mode
const mockUserProfile: UserProfile = {
  _id: 'demo-user-1',
  username: 'demo_user',
  displayName: 'Demo User',
  email: 'demo@tipper.com',
  avatar: 'https://via.placeholder.com/150/8B5CF6/FFFFFF?text=D',
  coverPhoto: 'https://via.placeholder.com/800x200/8B5CF6/FFFFFF?text=Cover+Photo',
  bio: '¡Hola! Soy un usuario de demostración en TIPPER. Esta es mi bio de ejemplo donde puedo compartir información sobre mí.',
  location: 'Madrid, España',
  website: 'https://tipper-demo.com',
  joinDate: new Date('2024-01-15'),
  followers: 1250,
  following: 340,
  posts: 45,
  isVerified: true,
  isPrivate: false,
  isFollowing: false
};

const mockPosts: Post[] = [
  {
    _id: 'post-1',
    author: {
      _id: 'demo-user-1',
      username: 'demo_user',
      displayName: 'Demo User',
      avatar: 'https://via.placeholder.com/40/8B5CF6/FFFFFF?text=D'
    },
    content: '¡Mi primer post en TIPPER! Esta plataforma es increíble 🚀',
    media: {
      type: 'image',
      url: 'https://via.placeholder.com/600x400/8B5CF6/FFFFFF?text=Post+1',
      thumbnail: 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Thumb'
    },
    likes: 24,
    comments: 8,
    shares: 3,
    isLiked: false,
    createdAt: new Date('2024-01-20T10:30:00'),
    updatedAt: new Date('2024-01-20T10:30:00')
  },
  {
    _id: 'post-2',
    author: {
      _id: 'demo-user-1',
      username: 'demo_user',
      displayName: 'Demo User',
      avatar: 'https://via.placeholder.com/40/8B5CF6/FFFFFF?text=D'
    },
    content: 'Compartiendo mi experiencia con los tokens de TIPPER. ¡El sistema de propinas funciona perfectamente! 💎',
    likes: 156,
    comments: 23,
    shares: 45,
    isLiked: true,
    createdAt: new Date('2024-01-19T15:45:00'),
    updatedAt: new Date('2024-01-19T15:45:00')
  }
];

const mockFollowers: UserProfile[] = [
  {
    _id: 'user-1',
    username: 'ana_garcia',
    displayName: 'Ana García',
    email: 'ana@example.com',
    avatar: 'https://via.placeholder.com/40/667eea/ffffff?text=AG',
    joinDate: new Date('2024-01-10'),
    followers: 890,
    following: 234,
    posts: 67,
    isVerified: true,
    isPrivate: false
  },
  {
    _id: 'user-2',
    username: 'carlos_lopez',
    displayName: 'Carlos López',
    email: 'carlos@example.com',
    avatar: 'https://via.placeholder.com/40/4ecdc4/ffffff?text=CL',
    joinDate: new Date('2024-01-12'),
    followers: 456,
    following: 123,
    posts: 34,
    isVerified: false,
    isPrivate: false
  }
];

const mockFollowing: UserProfile[] = [
  {
    _id: 'user-3',
    username: 'maria_rodriguez',
    displayName: 'María Rodríguez',
    email: 'maria@example.com',
    avatar: 'https://via.placeholder.com/40/45b7d1/ffffff?text=MR',
    joinDate: new Date('2024-01-08'),
    followers: 1200,
    following: 567,
    posts: 89,
    isVerified: true,
    isPrivate: false
  },
  {
    _id: 'user-4',
    username: 'juan_perez',
    displayName: 'Juan Pérez',
    email: 'juan@example.com',
    avatar: 'https://via.placeholder.com/40/f0932b/ffffff?text=JP',
    joinDate: new Date('2024-01-05'),
    followers: 789,
    following: 234,
    posts: 56,
    isVerified: false,
    isPrivate: false
  }
];

class ProfileService {
  async getUserProfile(username: string): Promise<UserProfile> {
    // In demo mode, return mock data
    if (username === 'demo_user') {
      return mockUserProfile;
    }
    
    // For other users, return a modified version of mock data
    return {
      ...mockUserProfile,
      username,
      displayName: username.charAt(0).toUpperCase() + username.slice(1).replace('_', ' '),
      avatar: `https://via.placeholder.com/150/8B5CF6/FFFFFF?text=${username.charAt(0).toUpperCase()}`,
      followers: Math.floor(Math.random() * 1000) + 100,
      following: Math.floor(Math.random() * 500) + 50,
      posts: Math.floor(Math.random() * 100) + 10
    };
  }

  async getCurrentUserProfile(): Promise<UserProfile> {
    return mockUserProfile;
  }

  async getUserPosts(username: string, page: number = 1, limit: number = 10): Promise<{ posts: Post[]; total: number; hasMore: boolean; }> {
    // Return mock posts for demo user
    if (username === 'demo_user') {
      return {
        posts: mockPosts,
        total: mockPosts.length,
        hasMore: false
      };
    }
    
    // For other users, return empty posts
    return {
      posts: [],
      total: 0,
      hasMore: false
    };
  }

  async getSavedPosts(page: number = 1, limit: number = 10): Promise<{ posts: Post[]; total: number; hasMore: boolean; }> {
    return {
      posts: mockPosts.slice(0, 2), // Return first 2 posts as saved
      total: 2,
      hasMore: false
    };
  }

  async getFollowers(username: string, page: number = 1, limit: number = 20): Promise<{ users: UserProfile[]; total: number; hasMore: boolean; }> {
    return {
      users: mockFollowers,
      total: mockFollowers.length,
      hasMore: false
    };
  }

  async getFollowing(username: string, page: number = 1, limit: number = 20): Promise<{ users: UserProfile[]; total: number; hasMore: boolean; }> {
    return {
      users: mockFollowing,
      total: mockFollowing.length,
      hasMore: false
    };
  }

  async followUser(userId: string): Promise<void> {
    // In demo mode, just log the action
    console.log('Demo: Following user', userId);
  }

  async unfollowUser(userId: string): Promise<void> {
    // In demo mode, just log the action
    console.log('Demo: Unfollowing user', userId);
  }

  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    // In demo mode, just log the action and return updated profile
    console.log('Demo: Updating profile', profileData);
    return { ...mockUserProfile, ...profileData };
  }

  async uploadAvatar(file: File): Promise<{ avatar: string }> {
    // In demo mode, create a data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({ avatar: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    });
  }

  async uploadCoverPhoto(file: File): Promise<{ coverPhoto: string }> {
    // In demo mode, create a data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({ coverPhoto: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    });
  }

  async likePost(postId: string): Promise<void> {
    console.log('Demo: Liking post', postId);
  }

  async unlikePost(postId: string): Promise<void> {
    console.log('Demo: Unliking post', postId);
  }

  async savePost(postId: string): Promise<void> {
    console.log('Demo: Saving post', postId);
  }

  async unsavePost(postId: string): Promise<void> {
    console.log('Demo: Unsaving post', postId);
  }
}

const profileService = new ProfileService();
export default profileService; 