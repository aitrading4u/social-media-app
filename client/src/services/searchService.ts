import { UserProfile, Post } from './mockProfileService';

export interface SearchResult {
  type: 'user' | 'post' | 'hashtag';
  data: UserProfile | Post | { name: string; count: number };
  relevance: number;
}

export interface SearchFilters {
  type?: 'user' | 'post' | 'hashtag' | 'all';
  sortBy?: 'relevance' | 'date' | 'popularity';
}

// Mock data for search
const mockUsers: UserProfile[] = [
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
    username: 'mikejohnson',
    displayName: 'Mike Johnson',
    email: 'mike@example.com',
    bio: '📸 Photography enthusiast and travel blogger. Exploring the world one photo at a time! 🌍',
    location: 'Valencia, Spain',
    website: 'https://mikejohnson.photo',
    avatar: 'https://via.placeholder.com/150/ff6b6b/ffffff?text=MJ',
    coverPhoto: 'https://via.placeholder.com/1200x400/ff6b6b/ffffff?text=Travel+Photography',
    joinDate: new Date('2024-03-10'),
    followers: 567,
    following: 123,
    posts: 234,
    isVerified: false,
    isPrivate: false,
    isFollowing: false
  },
  {
    _id: '4',
    username: 'sarahwilson',
    displayName: 'Sarah Wilson',
    email: 'sarah@example.com',
    bio: '🎵 Music producer and DJ. Creating beats that make you move! 🎧',
    location: 'Sevilla, Spain',
    website: 'https://sarahwilson.music',
    avatar: 'https://via.placeholder.com/150/4ecdc4/ffffff?text=SW',
    coverPhoto: 'https://via.placeholder.com/1200x400/4ecdc4/ffffff?text=Music+Studio',
    joinDate: new Date('2024-01-05'),
    followers: 2341,
    following: 456,
    posts: 78,
    isVerified: true,
    isPrivate: false,
    isFollowing: true
  },
  {
    _id: '5',
    username: 'alexgarcia',
    displayName: 'Alex García',
    email: 'alex@example.com',
    bio: '🏃‍♂️ Fitness coach and nutrition expert. Helping people achieve their health goals! 💪',
    location: 'Bilbao, Spain',
    website: 'https://alexgarcia.fitness',
    avatar: 'https://via.placeholder.com/150/45b7d1/ffffff?text=AG',
    coverPhoto: 'https://via.placeholder.com/1200x400/45b7d1/ffffff?text=Fitness+Life',
    joinDate: new Date('2024-02-15'),
    followers: 1890,
    following: 234,
    posts: 145,
    isVerified: false,
    isPrivate: false,
    isFollowing: false
  }
];

const mockPosts: Post[] = [
  {
    _id: 'post1',
    author: {
      _id: '1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: 'https://via.placeholder.com/150/667eea/ffffff?text=JD'
    },
    content: 'Just finished building an amazing new feature for our social media platform! 🚀 #coding #webdev #innovation',
    media: {
      type: 'image',
      url: 'https://via.placeholder.com/800x600/667eea/ffffff?text=Coding+Project',
      thumbnail: 'https://via.placeholder.com/400x300/667eea/ffffff?text=Thumbnail'
    },
    likes: 156,
    comments: 23,
    shares: 12,
    isLiked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    _id: 'post2',
    author: {
      _id: '2',
      username: 'janesmith',
      displayName: 'Jane Smith',
      avatar: 'https://via.placeholder.com/150/4ecdc4/ffffff?text=JS'
    },
    content: 'New design project completed! Love how this turned out ✨ #design #creativity #art',
    media: {
      type: 'image',
      url: 'https://via.placeholder.com/800x600/4ecdc4/ffffff?text=Design+Project',
      thumbnail: 'https://via.placeholder.com/400x300/4ecdc4/ffffff?text=Thumbnail'
    },
    likes: 89,
    comments: 15,
    shares: 8,
    isLiked: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
  },
  {
    _id: 'post3',
    author: {
      _id: '3',
      username: 'mikejohnson',
      displayName: 'Mike Johnson',
      avatar: 'https://via.placeholder.com/150/ff6b6b/ffffff?text=MJ'
    },
    content: 'Amazing sunset in Valencia today! 📸 #photography #sunset #valencia #spain',
    media: {
      type: 'image',
      url: 'https://via.placeholder.com/800x600/ff6b6b/ffffff?text=Sunset+Photo',
      thumbnail: 'https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Thumbnail'
    },
    likes: 234,
    comments: 34,
    shares: 45,
    isLiked: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

const mockHashtags = [
  { name: '#coding', count: 1234 },
  { name: '#design', count: 890 },
  { name: '#photography', count: 567 },
  { name: '#music', count: 432 },
  { name: '#fitness', count: 345 },
  { name: '#travel', count: 678 },
  { name: '#innovation', count: 234 },
  { name: '#creativity', count: 456 }
];

// Search function
export const searchContent = async (
  query: string,
  filters: SearchFilters = {}
): Promise<SearchResult[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  if (!query.trim()) {
    return [];
  }

  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  // Search users
  if (filters.type === 'all' || filters.type === 'user' || !filters.type) {
    const userResults = mockUsers
      .filter(user => 
        user.username.toLowerCase().includes(lowerQuery) ||
        user.displayName.toLowerCase().includes(lowerQuery) ||
        user.bio?.toLowerCase().includes(lowerQuery)
      )
      .map(user => ({
        type: 'user' as const,
        data: user,
        relevance: calculateRelevance(user, lowerQuery)
      }));
    results.push(...userResults);
  }

  // Search posts
  if (filters.type === 'all' || filters.type === 'post' || !filters.type) {
    const postResults = mockPosts
      .filter(post => 
        post.content.toLowerCase().includes(lowerQuery) ||
        post.author.username.toLowerCase().includes(lowerQuery) ||
        post.author.displayName.toLowerCase().includes(lowerQuery)
      )
      .map(post => ({
        type: 'post' as const,
        data: post,
        relevance: calculateRelevance(post, lowerQuery)
      }));
    results.push(...postResults);
  }

  // Search hashtags
  if (filters.type === 'all' || filters.type === 'hashtag' || !filters.type) {
    const hashtagResults = mockHashtags
      .filter(hashtag => hashtag.name.toLowerCase().includes(lowerQuery))
      .map(hashtag => ({
        type: 'hashtag' as const,
        data: hashtag,
        relevance: hashtag.count // Use count as relevance for hashtags
      }));
    results.push(...hashtagResults);
  }

  // Sort results
  if (filters.sortBy === 'date') {
    results.sort((a, b) => {
      if (a.type === 'post' && b.type === 'post') {
        const postA = a.data as Post;
        const postB = b.data as Post;
        return new Date(postB.createdAt).getTime() - new Date(postA.createdAt).getTime();
      }
      return 0;
    });
  } else if (filters.sortBy === 'popularity') {
    results.sort((a, b) => {
      if (a.type === 'post' && b.type === 'post') {
        const postA = a.data as Post;
        const postB = b.data as Post;
        return postB.likes - postA.likes;
      }
      if (a.type === 'user' && b.type === 'user') {
        const userA = a.data as UserProfile;
        const userB = b.data as UserProfile;
        return userB.followers - userA.followers;
      }
      return 0;
    });
  } else {
    // Default: sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);
  }

  return results.slice(0, 20); // Limit results
};

// Calculate relevance score
const calculateRelevance = (item: any, query: string): number => {
  let score = 0;
  
  if (item.username && item.username.toLowerCase().includes(query)) {
    score += 10;
  }
  
  if (item.displayName && item.displayName.toLowerCase().includes(query)) {
    score += 8;
  }
  
  if (item.bio && item.bio.toLowerCase().includes(query)) {
    score += 5;
  }
  
  if (item.content && item.content.toLowerCase().includes(query)) {
    score += 6;
  }
  
  // Boost verified users
  if (item.isVerified) {
    score += 2;
  }
  
  // Boost by followers/popularity
  if (item.followers) {
    score += Math.min(item.followers / 1000, 5);
  }
  
  if (item.likes) {
    score += Math.min(item.likes / 100, 3);
  }
  
  return score;
};

// Get trending searches
export const getTrendingSearches = async (): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [
    '#coding',
    '#design',
    '#photography',
    'johndoe',
    'janesmith',
    '#innovation',
    '#creativity',
    '#travel'
  ];
};

// Get recent searches
export const getRecentSearches = (): string[] => {
  const recent = localStorage.getItem('recentSearches');
  return recent ? JSON.parse(recent) : [];
};

// Save recent search
export const saveRecentSearch = (query: string): void => {
  const recent = getRecentSearches();
  const filtered = recent.filter((item: string) => item !== query);
  const updated = [query, ...filtered].slice(0, 10); // Keep last 10
  localStorage.setItem('recentSearches', JSON.stringify(updated));
}; 