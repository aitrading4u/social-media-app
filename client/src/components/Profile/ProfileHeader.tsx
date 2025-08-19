import React from 'react';
import {
  Box,
  Avatar,
  Typography,
  Button,
  IconButton,
  Chip,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Edit as EditIcon,
  Settings as SettingsIcon,
  Share as ShareIcon,
  LocationOn as LocationIcon,
  Link as LinkIcon,
  CalendarToday as CalendarIcon,
  PhotoCamera as PhotoIcon
} from '@mui/icons-material';
import { UserProfile } from '../../services/mockProfileService';

interface ProfileHeaderProps {
  user: UserProfile;
  isFollowing: boolean;
  onFollow: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onSettings?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isFollowing,
  onFollow,
  onEdit,
  onShare,
  onSettings
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: 3, mb: 2, mt: 2 }}>
      <Box sx={{ flex: 1, minWidth: 200 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {user.displayName}
          </Typography>
          {user.isVerified && (
            <Chip
              label="✓"
              size="small"
              sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 'bold' }}
            />
          )}
          {user.isPrivate && (
            <Chip
              label="🔒"
              size="small"
              sx={{ backgroundColor: 'rgba(0,0,0,0.1)', color: 'black' }}
            />
          )}
        </Box>
        <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
          @{user.username}
        </Typography>
        {user.bio && (
          <Typography variant="body1" sx={{ mb: 2, maxWidth: 600 }}>
            {user.bio}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          {user.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationIcon fontSize="small" />
              <Typography variant="body2">{user.location}</Typography>
            </Box>
          )}
          {user.website && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LinkIcon fontSize="small" />
              <Typography variant="body2" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
                {user.website}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarIcon fontSize="small" />
            <Typography variant="body2">
              Joined {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, mb: isMobile ? 2 : 0 }}>
        <Button
          variant={isFollowing ? 'outlined' : 'contained'}
          onClick={onFollow}
          sx={{
            backgroundColor: isFollowing ? 'transparent' : 'primary.main',
            color: isFollowing ? 'primary.main' : 'white',
            borderColor: 'primary.main',
            '&:hover': {
              backgroundColor: isFollowing ? 'rgba(25, 118, 210, 0.1)' : 'primary.dark'
            }
          }}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
        
        {onEdit && (
          <IconButton 
            sx={{ backgroundColor: 'grey.100', color: 'primary.main', '&:hover': { backgroundColor: 'grey.200' } }}
            onClick={onEdit}
          >
            <EditIcon />
          </IconButton>
        )}
        
        {onShare && (
          <IconButton 
            sx={{ backgroundColor: 'grey.100', color: 'primary.main', '&:hover': { backgroundColor: 'grey.200' } }}
            onClick={onShare}
          >
            <ShareIcon />
          </IconButton>
        )}
        
        {onSettings && (
          <IconButton 
            sx={{ backgroundColor: 'grey.100', color: 'primary.main', '&:hover': { backgroundColor: 'grey.200' } }}
            onClick={onSettings}
          >
            <SettingsIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default ProfileHeader; 