import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Avatar
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { Post } from '../../services/mockProfileService';

interface ProfilePostProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onMore?: (postId: string) => void;
}

const ProfilePost: React.FC<ProfilePostProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onMore
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2, mb: 3, overflow: 'hidden' }}>
      {/* Post Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Avatar src={post.author.avatar} sx={{ width: 40, height: 40 }}>
          {post.author.displayName.charAt(0)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {post.author.displayName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDate(post.createdAt)}
          </Typography>
        </Box>
        {onMore && (
          <IconButton size="small" onClick={() => onMore(post._id)}>
            <MoreVertIcon />
          </IconButton>
        )}
      </Box>

      {/* Post Content */}
      {post.media && (
        <CardMedia
          component={post.media.type === 'video' ? 'video' : 'img'}
          image={post.media.url}
          alt="Post"
          sx={{ 
            height: 350, 
            objectFit: 'cover', 
            background: '#eee',
            cursor: 'pointer'
          }}
          controls={post.media.type === 'video'}
        />
      )}

      <CardContent sx={{ p: 2 }}>
        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.5 }}>
          {post.content}
        </Typography>

        {/* Engagement Stats */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {formatNumber(post.likes)} likes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatNumber(post.comments)} comments
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatNumber(post.shares)} shares
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              size="small" 
              sx={{ 
                color: post.isLiked ? 'error.main' : 'text.secondary',
                '&:hover': { 
                  backgroundColor: post.isLiked ? 'error.light' : 'action.hover',
                  color: post.isLiked ? 'error.dark' : 'text.primary'
                }
              }}
              onClick={() => onLike(post._id)}
            >
              {post.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {formatNumber(post.likes)}
            </Typography>

            {onComment && (
              <>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': { backgroundColor: 'action.hover', color: 'text.primary' }
                  }}
                  onClick={() => onComment(post._id)}
                >
                  <CommentIcon />
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                  {formatNumber(post.comments)}
                </Typography>
              </>
            )}

            {onShare && (
              <>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': { backgroundColor: 'action.hover', color: 'text.primary' }
                  }}
                  onClick={() => onShare(post._id)}
                >
                  <ShareIcon />
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                  {formatNumber(post.shares)}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfilePost; 