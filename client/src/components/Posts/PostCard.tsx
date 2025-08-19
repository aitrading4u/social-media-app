import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Typography,
  IconButton,
  Box,
  Chip,
  Button,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Collapse,
  useTheme,
  alpha,
  Divider,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Favorite as LikeIcon,
  FavoriteBorder as LikeOutlineIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkFilledIcon,
  MoreVert as MoreIcon,
  Send as SendIcon,
  PlayArrow as PlayIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as VolumeOffIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import TipButton from '../Tokens/TipButton';



interface Post {
  _id: string;
  author: {
    _id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }[];
  hashtags?: string[];
  privacy: 'public' | 'friends' | 'private';
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onShare: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onEdit?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onDelete,
  onEdit
}) => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [videoPlaying, setVideoPlaying] = useState<{ [key: string]: boolean }>({});
  const [videoMuted, setVideoMuted] = useState<{ [key: string]: boolean }>({});

  const handleLike = () => {
    onLike(post._id);
  };

  const handleComment = async () => {
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onComment(post._id, commentText);
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    onShare(post._id);
  };

  const handleBookmark = () => {
    onBookmark(post._id);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete?.(post._id);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit?.(post._id);
  };

  const toggleVideoPlay = (mediaIndex: number) => {
    const videoElement = document.getElementById(`video-${post._id}-${mediaIndex}`) as HTMLVideoElement;
    if (videoElement) {
      if (videoPlaying[`${post._id}-${mediaIndex}`]) {
        videoElement.pause();
        setVideoPlaying(prev => ({ ...prev, [`${post._id}-${mediaIndex}`]: false }));
      } else {
        videoElement.play();
        setVideoPlaying(prev => ({ ...prev, [`${post._id}-${mediaIndex}`]: true }));
      }
    }
  };

  const toggleVideoMute = (mediaIndex: number) => {
    const videoElement = document.getElementById(`video-${post._id}-${mediaIndex}`) as HTMLVideoElement;
    if (videoElement) {
      videoElement.muted = !videoMuted[`${post._id}-${mediaIndex}`];
      setVideoMuted(prev => ({ ...prev, [`${post._id}-${mediaIndex}`]: !videoMuted[`${post._id}-${mediaIndex}`] }));
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const isOwnPost = user?.id === post.author._id;

  return (
    <Card sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      {/* Post Header */}
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              src={post.author.avatar}
              sx={{ width: 48, height: 48, cursor: 'pointer' }}
            >
              {post.author.displayName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, cursor: 'pointer' }}>
                {post.author.displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{post.author.username} • {formatTimeAgo(post.createdAt)}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Privacy indicator */}
            <Chip
              label={post.privacy}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
            
            {/* More options menu */}
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>

      {/* Post Content */}
      {post.content && (
        <CardContent sx={{ pt: 0, pb: post.media && post.media.length > 0 ? 1 : 2 }}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {post.content}
          </Typography>
          
          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {post.hashtags.map((hashtag) => (
                <Chip
                  key={hashtag}
                  label={`#${hashtag}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          )}
        </CardContent>
      )}

      {/* Media Content */}
      {post.media && post.media.length > 0 && (
        <Box sx={{ position: 'relative' }}>
          {post.media.map((media, index) => (
            <Box key={index} sx={{ position: 'relative' }}>
              {media.type === 'image' ? (
                <CardMedia
                  component="img"
                  image={media.url}
                  alt="Post media"
                  sx={{ 
                    height: 400,
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }}
                />
              ) : (
                <Box sx={{ position: 'relative', height: 400 }}>
                  <video
                    id={`video-${post._id}-${index}`}
                    src={media.url}
                    poster={media.thumbnail}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onPlay={() => setVideoPlaying(prev => ({ ...prev, [`${post._id}-${index}`]: true }))}
                    onPause={() => setVideoPlaying(prev => ({ ...prev, [`${post._id}-${index}`]: false }))}
                  />
                  
                  {/* Video Controls Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      display: 'flex',
                      gap: 1
                    }}
                  >
                    <IconButton
                      onClick={() => toggleVideoPlay(index)}
                      sx={{
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                      }}
                    >
                      {videoPlaying[`${post._id}-${index}`] ? <PlayIcon /> : <PlayIcon />}
                    </IconButton>
                    
                    <IconButton
                      onClick={() => toggleVideoMute(index)}
                      sx={{
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                      }}
                    >
                      {videoMuted[`${post._id}-${index}`] ? <VolumeOffIcon /> : <VolumeIcon />}
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Post Stats */}
      <CardContent sx={{ pt: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {post.likes.toLocaleString()} likes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {post.comments.toLocaleString()} comments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {post.shares.toLocaleString()} shares
          </Typography>
        </Box>
      </CardContent>

      <Divider />

      {/* Action Buttons */}
      <CardContent sx={{ pt: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button
            startIcon={post.isLiked ? <LikeIcon /> : <LikeOutlineIcon />}
            onClick={handleLike}
            sx={{
              color: post.isLiked ? theme.palette.error.main : 'text.secondary',
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.1)
              }
            }}
          >
            Like
          </Button>
          
          <Button
            startIcon={<CommentIcon />}
            onClick={() => setShowComments(!showComments)}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              }
            }}
          >
            Comment
          </Button>
          
          <Button
            startIcon={<ShareIcon />}
            onClick={handleShare}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: alpha(theme.palette.success.main, 0.1)
              }
            }}
          >
            Share
          </Button>
          
          <Button
            startIcon={post.isBookmarked ? <BookmarkFilledIcon /> : <BookmarkIcon />}
            onClick={handleBookmark}
            sx={{
              color: post.isBookmarked ? theme.palette.warning.main : 'text.secondary',
              '&:hover': {
                backgroundColor: alpha(theme.palette.warning.main, 0.1)
              }
            }}
          >
            Save
          </Button>
           
           <TipButton
             recipientId={post.author._id}
             recipientName={post.author.displayName}
             recipientAvatar={post.author.avatar}
             onTipSent={(amount, message) => {
               console.log(`Tip sent: ${amount} tokens with message: ${message}`);
             }}
           />
        </Box>
      </CardContent>

      {/* Comments Section */}
      <Collapse in={showComments}>
        <Divider />
        <CardContent sx={{ pt: 2 }}>
          {/* Comment Input */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Avatar 
              src={user?.avatar}
              sx={{ width: 32, height: 32 }}
            >
              {user?.displayName?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ flex: 1, display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                size="small"
                disabled={isSubmitting}
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
              <IconButton
                onClick={handleComment}
                disabled={!commentText.trim() || isSubmitting}
                color="primary"
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Comments List */}
          <List sx={{ pt: 0 }}>
            {/* Mock comments - in real app, these would come from API */}
            <ListItem sx={{ px: 0 }}>
              <ListItemAvatar>
                <Avatar src="https://via.placeholder.com/32/4ecdc4/ffffff?text=JS" />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Jane Smith
                    </Typography>
                    <Typography variant="body2">
                      Great post! Love the content 🎉
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      2 hours ago
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          </List>
        </CardContent>
      </Collapse>

      {/* More Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: 2, minWidth: 150 }
        }}
      >
        {isOwnPost && (
          <>
            <MenuItem onClick={handleEdit}>
              Edit Post
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              Delete Post
            </MenuItem>
          </>
        )}
        <MenuItem onClick={handleMenuClose}>
          Report Post
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          Copy Link
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default PostCard; 