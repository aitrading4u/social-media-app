import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Rating,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Badge,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Favorite as HeartIcon,
  FavoriteBorder as HeartOutlineIcon,
  Visibility as ViewIcon,
  VisibilityOff as ViewOffIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  LocalOffer as OfferIcon,
  TrendingUp as TrendingIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';

interface CreatorProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  type: 'digital' | 'service' | 'exclusive' | 'course' | 'adult';
  category: string;
  isAdultContent: boolean;
  contentWarnings: string[];
  creator: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
    rating: number;
    followers: number;
  };
  images: string[];
  rating: number;
  reviews: number;
  sales: number;
  tags: string[];
  isLiked: boolean;
  isBookmarked: boolean;
  inCart: boolean;
  discount?: number;
  featured?: boolean;
}

interface CreatorMarketplaceProps {
  onProductClick?: (product: CreatorProduct) => void;
}

const CreatorMarketplace: React.FC<CreatorMarketplaceProps> = ({
  onProductClick
}) => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const [products, setProducts] = useState<CreatorProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<CreatorProduct | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('trending');
  const [cartItems, setCartItems] = useState<CreatorProduct[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });
  
  // Age verification and content filtering
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [showAdultContent, setShowAdultContent] = useState(false);
  const [showContentWarning, setShowContentWarning] = useState(false);
  const [selectedAdultProduct, setSelectedAdultProduct] = useState<CreatorProduct | null>(null);

  // Mock products data
  const mockProducts: CreatorProduct[] = [
    {
      id: '1',
      title: 'Complete React Development Course',
      description: 'Master React with this comprehensive course covering hooks, context, and advanced patterns.',
      price: 49.99,
      originalPrice: 99.99,
      type: 'course',
      category: 'education',
      isAdultContent: false,
      contentWarnings: [],
      creator: {
        id: '1',
        name: 'Sarah Chen',
        username: 'sarahchen',
        avatar: 'https://via.placeholder.com/150/4ecdc4/ffffff?text=SC',
        isVerified: true,
        rating: 4.8,
        followers: 12470
      },
      images: ['https://via.placeholder.com/400/667eea/ffffff?text=React+Course'],
      rating: 4.8,
      reviews: 234,
      sales: 1234,
      tags: ['react', 'javascript', 'webdev', 'course'],
      isLiked: false,
      isBookmarked: false,
      inCart: false,
      discount: 50,
      featured: true
    },
    {
      id: '2',
      title: 'UI Design Templates Bundle',
      description: 'Collection of 50+ modern UI design templates for web and mobile applications.',
      price: 29.99,
      type: 'digital',
      category: 'design',
      isAdultContent: false,
      contentWarnings: [],
      creator: {
        id: '2',
        name: 'Alex Rodriguez',
        username: 'alexrodriguez',
        avatar: 'https://via.placeholder.com/150/ff6b6b/ffffff?text=AR',
        isVerified: true,
        rating: 4.9,
        followers: 8920
      },
      images: ['https://via.placeholder.com/400/4ecdc4/ffffff?text=UI+Templates'],
      rating: 4.9,
      reviews: 156,
      sales: 892,
      tags: ['ui', 'design', 'templates', 'figma'],
      isLiked: true,
      isBookmarked: false,
      inCart: false
    },
    {
      id: '3',
      title: '1-on-1 Code Review Session',
      description: 'Get personalized feedback on your code from an experienced developer.',
      price: 75.00,
      type: 'service',
      category: 'consulting',
      isAdultContent: false,
      contentWarnings: [],
      creator: {
        id: '3',
        name: 'Mike Johnson',
        username: 'mikejohnson',
        avatar: 'https://via.placeholder.com/150/e17055/ffffff?text=MJ',
        isVerified: true,
        rating: 4.7,
        followers: 15680
      },
      images: ['https://via.placeholder.com/400/6c5ce7/ffffff?text=Code+Review'],
      rating: 4.7,
      reviews: 89,
      sales: 234,
      tags: ['consulting', 'code-review', 'mentorship'],
      isLiked: false,
      isBookmarked: true,
      inCart: false
    },
    {
      id: '4',
      title: 'Exclusive Content Bundle',
      description: 'Access to exclusive content, behind-the-scenes videos, and tutorials.',
      price: 19.99,
      type: 'exclusive',
      category: 'content',
      isAdultContent: false,
      contentWarnings: [],
      creator: {
        id: '4',
        name: 'Emma Wilson',
        username: 'emmawilson',
        avatar: 'https://via.placeholder.com/150/00b894/ffffff?text=EW',
        isVerified: true,
        rating: 4.6,
        followers: 8920
      },
      images: ['https://via.placeholder.com/400/ff6b6b/ffffff?text=Exclusive+Content'],
      rating: 4.6,
      reviews: 67,
      sales: 445,
      tags: ['exclusive', 'content', 'tutorials'],
      isLiked: false,
      isBookmarked: false,
      inCart: false
    },
    {
      id: '5',
      title: 'TypeScript Masterclass',
      description: 'Advanced TypeScript patterns and best practices for enterprise applications.',
      price: 39.99,
      originalPrice: 79.99,
      type: 'course',
      category: 'education',
      isAdultContent: false,
      contentWarnings: [],
      creator: {
        id: '5',
        name: 'David Kim',
        username: 'davidkim',
        avatar: 'https://via.placeholder.com/150/667eea/ffffff?text=DK',
        isVerified: true,
        rating: 4.9,
        followers: 23410
      },
      images: ['https://via.placeholder.com/400/4ecdc4/ffffff?text=TypeScript+Course'],
      rating: 4.9,
      reviews: 312,
      sales: 1890,
      tags: ['typescript', 'javascript', 'advanced'],
      isLiked: true,
      isBookmarked: false,
      inCart: false,
      discount: 50
    },
    {
      id: '6',
      title: 'Custom Logo Design Service',
      description: 'Professional logo design service with unlimited revisions and source files.',
      price: 150.00,
      type: 'service',
      category: 'design',
      isAdultContent: false,
      contentWarnings: [],
      creator: {
        id: '6',
        name: 'Lisa Park',
        username: 'lisapark',
        avatar: 'https://via.placeholder.com/150/00b894/ffffff?text=LP',
        isVerified: true,
        rating: 4.8,
        followers: 6780
      },
      images: ['https://via.placeholder.com/400/6c5ce7/ffffff?text=Logo+Design'],
      rating: 4.8,
      reviews: 45,
      sales: 123,
      tags: ['logo', 'design', 'branding', 'service'],
      isLiked: false,
      isBookmarked: false,
      inCart: false
    },
    {
      id: '7',
      title: 'Lingerie Collection - Premium Underwear',
      description: 'Exclusive collection of premium lingerie and underwear sets for adults only.',
      price: 89.99,
      type: 'adult',
      category: 'fashion',
      isAdultContent: true,
      contentWarnings: ['Adult Content', 'Lingerie', 'Underwear'],
      creator: {
        id: '7',
        name: 'Sophia Martinez',
        username: 'sophiamartinez',
        avatar: 'https://via.placeholder.com/150/e17055/ffffff?text=SM',
        isVerified: true,
        rating: 4.7,
        followers: 15680
      },
      images: ['https://via.placeholder.com/400/ff6b6b/ffffff?text=Adult+Content'],
      rating: 4.7,
      reviews: 89,
      sales: 234,
      tags: ['lingerie', 'underwear', 'adult', 'fashion'],
      isLiked: false,
      isBookmarked: false,
      inCart: false
    },
    {
      id: '8',
      title: 'Adult Photography Session',
      description: 'Professional adult photography session with tasteful boudoir style.',
      price: 299.99,
      type: 'adult',
      category: 'photography',
      isAdultContent: true,
      contentWarnings: ['Adult Content', 'Nudity', 'Boudoir'],
      creator: {
        id: '8',
        name: 'Elena Rodriguez',
        username: 'elenarodriguez',
        avatar: 'https://via.placeholder.com/150/00b894/ffffff?text=ER',
        isVerified: true,
        rating: 4.9,
        followers: 8920
      },
      images: ['https://via.placeholder.com/400/6c5ce7/ffffff?text=Adult+Photography'],
      rating: 4.9,
      reviews: 67,
      sales: 156,
      tags: ['photography', 'adult', 'boudoir', 'professional'],
      isLiked: false,
      isBookmarked: false,
      inCart: false
    }
  ];

  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'education', name: 'Education' },
    { id: 'design', name: 'Design' },
    { id: 'consulting', name: 'Consulting' },
    { id: 'content', name: 'Content' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'photography', name: 'Photography' }
  ];

  const sortOptions = [
    { id: 'trending', name: 'Trending' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'newest', name: 'Newest' }
  ];



  const handleLike = (productId: string) => {
    setProducts(prev => prev.map(product => 
      product.id === productId ? { ...product, isLiked: !product.isLiked } : product
    ));
  };

  const handleBookmark = (productId: string) => {
    setProducts(prev => prev.map(product => 
      product.id === productId ? { ...product, isBookmarked: !product.isBookmarked } : product
    ));
  };

  const handleAddToCart = (product: CreatorProduct) => {
    setCartItems(prev => [...prev, product]);
    setProducts(prev => prev.map(p => 
      p.id === product.id ? { ...p, inCart: true } : p
    ));
    showSnackbar(`${product.title} added to cart!`, 'success');
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, inCart: false } : p
    ));
  };

  const handlePurchase = async (product: CreatorProduct) => {
    try {
      // Simulate purchase process
      await new Promise(resolve => setTimeout(resolve, 1500));
      showSnackbar(`Successfully purchased ${product.title}!`, 'success');
      setShowProductDialog(false);
    } catch (error) {
      showSnackbar('Purchase failed. Please try again.', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Age verification functions
  const handleAgeVerification = () => {
    setIsAgeVerified(true);
    setShowAgeVerification(false);
    showSnackbar('Age verification completed. You can now view adult content.', 'success');
  };

  const handleShowAdultContent = () => {
    if (!isAgeVerified) {
      setShowAgeVerification(true);
      return;
    }
    setShowAdultContent(!showAdultContent);
  };

  const handleProductClick = (product: CreatorProduct) => {
    if (product.isAdultContent && !isAgeVerified) {
      setSelectedAdultProduct(product);
      setShowContentWarning(true);
      return;
    }
    
    setSelectedProduct(product);
    setShowProductDialog(true);
    onProductClick?.(product);
  };

  const handleProceedToAdultContent = () => {
    if (selectedAdultProduct) {
      setSelectedProduct(selectedAdultProduct);
      setShowProductDialog(true);
      setShowContentWarning(false);
      setSelectedAdultProduct(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course': return theme.palette.primary.main;
      case 'digital': return theme.palette.success.main;
      case 'service': return theme.palette.warning.main;
      case 'exclusive': return theme.palette.secondary.main;
      case 'adult': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    // Filter adult content based on age verification and user preference
    if (product.isAdultContent) {
      if (!isAgeVerified || !showAdultContent) {
        return false;
      }
    }
    
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'newest': return new Date(b.id).getTime() - new Date(a.id).getTime();
      default: return b.sales - a.sales; // trending
    }
  });

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Creator Marketplace
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover amazing products and services from talented creators
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant={showAdultContent ? "contained" : "outlined"}
            color="warning"
            startIcon={showAdultContent ? <ViewIcon /> : <ViewOffIcon />}
            onClick={handleShowAdultContent}
            sx={{ 
              borderColor: theme.palette.warning.main,
              color: showAdultContent ? 'white' : theme.palette.warning.main,
              '&:hover': {
                backgroundColor: showAdultContent ? theme.palette.warning.dark : theme.palette.warning.light,
                color: 'white'
              }
            }}
          >
            {showAdultContent ? 'Hide Adult Content' : 'Show Adult Content'}
          </Button>
          <Badge badgeContent={cartItems.length} color="primary">
            <Button
              variant="outlined"
              startIcon={<CartIcon />}
              onClick={() => setActiveTab(1)}
            >
              Cart ({cartItems.length})
            </Button>
          </Badge>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Browse Products" />
          <Tab label="Shopping Cart" />
          <Tab label="My Purchases" />
        </Tabs>
      </Box>

      {/* Browse Products Tab */}
      {activeTab === 0 && (
        <Box>
          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <FilterIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ minWidth: 250 }}
            />
            <FormControl sx={{ minWidth: 150 }}>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                displayEmpty
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                displayEmpty
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Products Grid */}
          <Grid container spacing={3}>
            {sortedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                      transition: 'all 0.3s ease-in-out'
                    }
                  }}
                  onClick={() => handleProductClick(product)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.images[0]}
                    alt={product.title}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Avatar src={product.creator.avatar} sx={{ width: 24, height: 24 }}>
                        {product.creator.name.charAt(0)}
                      </Avatar>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {product.creator.name}
                      </Typography>
                      {product.creator.isVerified && <CheckIcon color="primary" fontSize="small" />}
                    </Box>
                    
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, lineHeight: 1.2 }}>
                      {product.title}
                    </Typography>
                    
                    {/* Content Warnings */}
                    {product.isAdultContent && (
                      <Box sx={{ mb: 1 }}>
                        <Chip
                          icon={<WarningIcon />}
                          label="Adult Content"
                          color="warning"
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        {product.contentWarnings.map((warning, index) => (
                          <Chip
                            key={index}
                            label={warning}
                            color="error"
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Rating value={product.rating} readOnly size="small" />
                      <Typography variant="caption" color="text.secondary">
                        ({product.reviews})
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                        {formatPrice(product.price)}
                      </Typography>
                      {product.originalPrice && (
                        <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                          {formatPrice(product.originalPrice)}
                        </Typography>
                      )}
                      {product.discount && (
                        <Chip label={`${product.discount}% OFF`} color="success" size="small" />
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {product.tags.slice(0, 2).map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(product.id);
                          }}
                        >
                          {product.isLiked ? <HeartIcon color="error" /> : <HeartOutlineIcon />}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookmark(product.id);
                          }}
                        >
                          {product.isBookmarked ? <CheckIcon color="primary" /> : <CancelIcon />}
                        </IconButton>
                        <IconButton size="small">
                          <OfferIcon />
                        </IconButton>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={product.inCart}
                      >
                        {product.inCart ? 'In Cart' : 'Add to Cart'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Shopping Cart Tab */}
      {activeTab === 1 && (
        <Box>
          {cartItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Your cart is empty
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add some products to get started
              </Typography>
            </Box>
          ) : (
            <Box>
              {cartItems.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={item.images[0]} variant="rounded" sx={{ width: 80, height: 80, mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      by {item.creator.name}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                      {formatPrice(item.price)}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromCart(item.id);
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total: {formatPrice(cartItems.reduce((sum, item) => sum + item.price, 0))}
                </Typography>
                <Button variant="contained" size="large">
                  Checkout
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* My Purchases Tab */}
      {activeTab === 2 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <OfferIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No purchases yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your purchased items will appear here
          </Typography>
        </Box>
      )}

      {/* Product Detail Dialog */}
      <Dialog
        open={showProductDialog}
        onClose={() => setShowProductDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedProduct && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {selectedProduct.title}
                </Typography>
                <Chip
                  label={selectedProduct.type}
                  color="primary"
                  variant="outlined"
                  sx={{ textTransform: 'capitalize' }}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.title}
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar src={selectedProduct.creator.avatar} sx={{ width: 48, height: 48 }}>
                        {selectedProduct.creator.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {selectedProduct.creator.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedProduct.creator.followers.toLocaleString()} followers
                        </Typography>
                      </Box>
                      {selectedProduct.creator.isVerified && <CheckIcon color="primary" />}
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Rating value={selectedProduct.rating} readOnly />
                      <Typography variant="body2" color="text.secondary">
                        {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                      </Typography>
                    </Box>
                    
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mb: 1 }}>
                      {formatPrice(selectedProduct.price)}
                    </Typography>
                    
                    {selectedProduct.originalPrice && (
                      <Typography variant="body1" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                        {formatPrice(selectedProduct.originalPrice)}
                      </Typography>
                    )}
                  </Box>
                  
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {selectedProduct.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                    {selectedProduct.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={() => handlePurchase(selectedProduct)}
                    >
                      Purchase Now
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => handleAddToCart(selectedProduct)}
                      disabled={selectedProduct.inCart}
                    >
                      {selectedProduct.inCart ? 'In Cart' : 'Add to Cart'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Age Verification Dialog */}
      <Dialog
        open={showAgeVerification}
        onClose={() => setShowAgeVerification(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <WarningIcon color="warning" sx={{ fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.warning.main }}>
              Age Verification Required
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            You must be 18 years or older to view adult content.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            By clicking "I am 18 or older", you confirm that you are of legal age to view adult content.
          </Typography>
          <Box sx={{ 
            p: 2, 
            backgroundColor: theme.palette.warning.light, 
            borderRadius: 2,
            mb: 3
          }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              ⚠️ This content may contain adult material including lingerie, underwear, and other adult-oriented products.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setShowAgeVerification(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleAgeVerification}
            sx={{ fontWeight: 'bold' }}
          >
            I am 18 or older
          </Button>
        </DialogActions>
      </Dialog>

      {/* Content Warning Dialog */}
      <Dialog
        open={showContentWarning}
        onClose={() => setShowContentWarning(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <CancelIcon color="error" sx={{ fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.error.main }}>
              Content Warning
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {selectedAdultProduct?.title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            This product contains adult content that requires age verification.
          </Typography>
          <Box sx={{ 
            p: 2, 
            backgroundColor: theme.palette.error.light, 
            borderRadius: 2,
            mb: 3
          }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Content Warnings:
            </Typography>
            {selectedAdultProduct?.contentWarnings.map((warning, index) => (
              <Chip
                key={index}
                label={warning}
                color="error"
                size="small"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
          <Typography variant="body2" color="text.secondary">
            You must verify your age to view this content.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setShowContentWarning(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              setShowContentWarning(false);
              setShowAgeVerification(true);
            }}
            sx={{ fontWeight: 'bold' }}
          >
            Verify Age
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreatorMarketplace; 