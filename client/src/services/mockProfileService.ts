// Mock data for testing
// This file contains mock data that can be used for testing the profile functionality

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

const mockUsers: UserProfile[] = [
  {
    _id: 'demo-user-1',
    username: 'demo_user',
    displayName: 'Demo User',
    email: 'demo@tipper.com',
    bio: '¡Hola! Soy un usuario de demostración en TIPPER. Esta es mi bio de ejemplo donde puedo compartir información sobre mí.',
    location: 'Madrid, España',
    website: 'https://tipper-demo.com',
    avatar: 'https://via.placeholder.com/150/8B5CF6/FFFFFF?text=D',
    coverPhoto: 'https://via.placeholder.com/800x200/8B5CF6/FFFFFF?text=Cover+Photo',
    joinDate: new Date('2024-01-15'),
    followers: 1250,
    following: 340,
    posts: 45,
    isVerified: true,
    isPrivate: false,
    isFollowing: false
  },
  {
    _id: '1',
    username: 'johndoe',
    displayName: 'John Doe',
    email: 'john@example.com',
    bio: '🚀 Full-stack developer passionate about creating amazing experiences. Building the future of social media with TIPPER! 💻✨',
    location: 'Madrid, Spain',
    website: 'https://johndoe.dev',
    avatar: 'https://via.placeholder.com/150/667eea/ffffff?text=JD',
    coverPhoto: 'https://via.placeholder.com/1200x400/667eea/ffffff?text=Cover+Photo',
    joinDate: new Date('2024-01-15'),
    followers: 1247,
    following: 89,
    posts: 156,
    isVerified: true,
    isPrivate: false,
    isFollowing: false
  },
  {
    _id: '2',
    username: 'janesmith',
    displayName: 'Jane Smith',
    email: 'jane@example.com',
    bio: '🎨 Creative designer and digital artist. Love sharing my work and connecting with fellow creators! ✨',
    location: 'Barcelona, Spain',
    website: 'https://janesmith.design',
    avatar: 'https://via.placeholder.com/150/4ecdc4/ffffff?text=JS',
    coverPhoto: 'https://via.placeholder.com/1200x400/4ecdc4/ffffff?text=Design+Portfolio',
    joinDate: new Date('2024-02-20'),
    followers: 892,
    following: 234,
    posts: 89,
    isVerified: false,
    isPrivate: false,
    isFollowing: true
  },
  {
    _id: '3',
    username: 'techguru',
    displayName: 'Tech Guru',
    email: 'tech@example.com',
    bio: '💻 Software architect and tech enthusiast. Always exploring new technologies and sharing insights! 🚀',
    location: 'Valencia, Spain',
    website: 'https://techguru.dev',
    avatar: 'https://via.placeholder.com/150/45b7d1/ffffff?text=TG',
    coverPhoto: 'https://via.placeholder.com/1200x400/45b7d1/ffffff?text=Tech+World',
    joinDate: new Date('2024-03-10'),
    followers: 2156,
    following: 156,
    posts: 234,
    isVerified: true,
    isPrivate: false,
    isFollowing: false
  },
  {
    _id: '4',
    username: 'mariagarcia',
    displayName: 'Maria Garcia',
    email: 'maria@example.com',
    bio: '📸 Travel photographer and adventure seeker. Capturing moments around the world! 🌍',
    location: 'Seville, Spain',
    website: 'https://mariagarcia.photo',
    avatar: 'https://via.placeholder.com/150/f0932b/ffffff?text=MG',
    coverPhoto: 'https://via.placeholder.com/1200x400/f0932b/ffffff?text=Travel+Photography',
    joinDate: new Date('2024-01-05'),
    followers: 3456,
    following: 445,
    posts: 567,
    isVerified: true,
    isPrivate: false,
    isFollowing: true
  }
];

const mockPosts: Post[] = [
  {
    _id: 'demo-post-1',
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
    _id: 'demo-post-2',
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
  },
  {
    _id: '1',
    author: {
      _id: '1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: 'https://via.placeholder.com/150/667eea/ffffff?text=JD'
    },
    content: '🚀 Just deployed my first TIPPER app! This social media platform is going to revolutionize how we connect and share content. The tipping system is absolutely brilliant! 💡✨ #TIPPER #SocialMedia #Innovation',
    media: {
      type: 'image',
      url: 'https://via.placeholder.com/800x600/667eea/ffffff?text=My+First+Post',
      thumbnail: 'https://via.placeholder.com/400x300/667eea/ffffff?text=Thumbnail'
    },
    likes: 42,
    comments: 8,
    shares: 3,
    isLiked: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '2',
    author: {
      _id: '1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: 'https://via.placeholder.com/150/667eea/ffffff?text=JD'
    },
    content: '💻 Working on some amazing features for TIPPER. The user experience is going to be incredible! Can\'t wait to share more updates with you all. #Development #UX #TIPPER',
    media: {
      type: 'image',
      url: 'https://via.placeholder.com/800x600/667eea/ffffff?text=Coding+Session',
      thumbnail: 'https://via.placeholder.com/400x300/667eea/ffffff?text=Code'
    },
    likes: 28,
    comments: 5,
    shares: 2,
    isLiked: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '3',
    author: {
      _id: '2',
      username: 'janesmith',
      displayName: 'Jane Smith',
      avatar: 'https://via.placeholder.com/150/4ecdc4/ffffff?text=JS'
    },
    content: '🎨 New design project completed! Love how TIPPER allows me to showcase my work and get direct feedback from the community. The tipping feature is such a great way to support creators! 🎭 #Design #Creativity #TIPPER',
    media: {
      type: 'image',
      url: 'https://via.placeholder.com/800x600/4ecdc4/ffffff?text=Design+Project',
      thumbnail: 'https://via.placeholder.com/400x300/4ecdc4/ffffff?text=Design'
    },
    likes: 67,
    comments: 12,
    shares: 7,
    isLiked: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '4',
    author: {
      _id: '2',
      username: 'janesmith',
      displayName: 'Jane Smith',
      avatar: 'https://via.placeholder.com/150/4ecdc4/ffffff?text=JS'
    },
    content: '✨ Exploring the creative possibilities on TIPPER! The platform really encourages authentic expression and meaningful connections. Love being part of this community! 🌟 #Community #Creativity',
    media: {
      type: 'image',
      url: 'https://via.placeholder.com/800x600/4ecdc4/ffffff?text=Creative+Work',
      thumbnail: 'https://via.placeholder.com/400x300/4ecdc4/ffffff?text=Creative'
    },
    likes: 34,
    comments: 6,
    shares: 4,
    isLiked: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '5',
    author: {
      _id: '3',
      username: 'techguru',
      displayName: 'Tech Guru',
      avatar: 'https://via.placeholder.com/150/45b7d1/ffffff?text=TG'
    },
    content: '💡 Tech insights: TIPPER\'s architecture is impressive! The way they handle real-time interactions and the token system is brilliant. This is the future of social media! 🔮 #Tech #Architecture #Innovation',
    media: {
      type: 'image',
      url: 'https://via.placeholder.com/800x600/45b7d1/ffffff?text=Tech+Insights',
      thumbnail: 'https://via.placeholder.com/400x300/45b7d1/ffffff?text=Tech'
    },
    likes: 89,
    comments: 15,
    shares: 12,
    isLiked: false,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '6',
    author: {
      _id: '3',
      username: 'techguru',
      displayName: 'Tech Guru',
      avatar: 'https://via.placeholder.com/150/45b7d1/ffffff?text=TG'
    },
    content: '🚀 The tipping system on TIPPER is revolutionary! It creates a direct value exchange between creators and supporters. This could change how we think about content monetization! 💰 #Innovation #Monetization #TIPPER',
    media: {
      type: 'image',
      url: 'https://via.placeholder.com/800x600/45b7d1/ffffff?text=Tipping+System',
      thumbnail: 'https://via.placeholder.com/400x300/45b7d1/ffffff?text=Tips'
    },
    likes: 156,
    comments: 23,
    shares: 18,
    isLiked: true,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
  }
];

const mockFollowers = [
  {
    _id: '5',
    username: 'alexchen',
    displayName: 'Alex Chen',
    email: 'alex@example.com',
    avatar: 'https://via.placeholder.com/150/6c5ce7/ffffff?text=AC',
    joinDate: new Date('2024-01-20'),
    followers: 567,
    following: 123,
    posts: 78,
    isVerified: false,
    isPrivate: false
  },
  {
    _id: '6',
    username: 'sarahwilson',
    displayName: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'https://via.placeholder.com/150/00b894/ffffff?text=SW',
    joinDate: new Date('2024-02-15'),
    followers: 1234,
    following: 89,
    posts: 234,
    isVerified: true,
    isPrivate: false
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockProfileService {
  async getUserProfile(username: string): Promise<UserProfile> {
    await delay(500); // Simulate network delay
    
    const user = mockUsers.find(u => u.username === username);
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  async getCurrentUserProfile(): Promise<UserProfile> {
    await delay(300);
    return mockUsers[0]; // Return demo_user as current user
  }

  async getUserPosts(username: string, page: number = 1, limit: number = 10): Promise<{ posts: Post[]; total: number; hasMore: boolean; }> {
    await delay(400);
    
    const userPosts = mockPosts.filter(post => post.author.username === username);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = userPosts.slice(startIndex, endIndex);
    
    return {
      posts: paginatedPosts,
      total: userPosts.length,
      hasMore: endIndex < userPosts.length
    };
  }

  async getSavedPosts(page: number = 1, limit: number = 10): Promise<{ posts: Post[]; total: number; hasMore: boolean; }> {
    await delay(400);
    
    const savedPosts = mockPosts.filter(post => post.isLiked);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = savedPosts.slice(startIndex, endIndex);
    
    return {
      posts: paginatedPosts,
      total: savedPosts.length,
      hasMore: endIndex < savedPosts.length
    };
  }

  async getFollowers(username: string, page: number = 1, limit: number = 20): Promise<{ users: UserProfile[]; total: number; hasMore: boolean; }> {
    await delay(300);
    
    return {
      users: mockFollowers,
      total: mockFollowers.length,
      hasMore: false
    };
  }

  async getFollowing(username: string, page: number = 1, limit: number = 20): Promise<{ users: UserProfile[]; total: number; hasMore: boolean; }> {
    await delay(300);
    
    return {
      users: mockUsers.slice(1, 3), // Return some users as following
      total: 2,
      hasMore: false
    };
  }

  async followUser(userId: string): Promise<void> {
    await delay(200);
    console.log(`Following user: ${userId}`);
  }

  async unfollowUser(userId: string): Promise<void> {
    await delay(200);
    console.log(`Unfollowing user: ${userId}`);
  }

  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    await delay(300);
    console.log('Updating profile:', profileData);
    return { ...mockUsers[0], ...profileData };
  }

  async uploadAvatar(file: File): Promise<{ avatar: string }> {
    await delay(1000);
    console.log('Uploading avatar:', file.name);
    return { avatar: 'https://via.placeholder.com/150/667eea/ffffff?text=New' };
  }

  async uploadCoverPhoto(file: File): Promise<{ coverPhoto: string }> {
    await delay(1000);
    console.log('Uploading cover photo:', file.name);
    return { coverPhoto: 'https://via.placeholder.com/1200x400/667eea/ffffff?text=New+Cover' };
  }

  async likePost(postId: string): Promise<void> {
    await delay(200);
    console.log(`Liking post: ${postId}`);
  }

  async unlikePost(postId: string): Promise<void> {
    await delay(200);
    console.log(`Unliking post: ${postId}`);
  }

  async savePost(postId: string): Promise<void> {
    await delay(200);
    console.log(`Saving post: ${postId}`);
  }

  async unsavePost(postId: string): Promise<void> {
    await delay(200);
    console.log(`Unsaving post: ${postId}`);
  }
}

const mockProfileService = new MockProfileService();
export default mockProfileService; 