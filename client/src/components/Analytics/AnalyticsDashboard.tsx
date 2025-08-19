import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
  alpha,
  Chip,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  TrendingDown as TrendingDownIcon,
  Visibility as ViewsIcon,
  Favorite as LikesIcon,
  Comment as CommentsIcon,
  Share as SharesIcon,
  Person as FollowersIcon,
  Schedule as TimeIcon,
  LocationOn as LocationIcon,
  Psychology as AIIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  MoreVert as MoreIcon,
  BarChart as ChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';

interface AnalyticsMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}

interface TopPost {
  id: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
  date: string;
}

interface AudienceInsight {
  type: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
}

interface AnalyticsDashboardProps {
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ timeRange = '30d' }) => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [loading, setLoading] = useState(false);

  // Mock analytics data
  const mockMetrics: AnalyticsMetric[] = [
    {
      id: '1',
      title: 'Total Views',
      value: '124.5K',
      change: 23.4,
      changeType: 'increase',
      icon: <ViewsIcon />,
      color: theme.palette.primary.main
    },
    {
      id: '2',
      title: 'Total Likes',
      value: '8.9K',
      change: 12.7,
      changeType: 'increase',
      icon: <LikesIcon />,
      color: theme.palette.error.main
    },
    {
      id: '3',
      title: 'Total Comments',
      value: '2.3K',
      change: -5.2,
      changeType: 'decrease',
      icon: <CommentsIcon />,
      color: theme.palette.warning.main
    },
    {
      id: '4',
      title: 'Total Shares',
      value: '1.8K',
      change: 8.9,
      changeType: 'increase',
      icon: <SharesIcon />,
      color: theme.palette.success.main
    },
    {
      id: '5',
      title: 'New Followers',
      value: '456',
      change: 15.3,
      changeType: 'increase',
      icon: <FollowersIcon />,
      color: theme.palette.info.main
    },
    {
      id: '6',
      title: 'Engagement Rate',
      value: '6.8%',
      change: 2.1,
      changeType: 'increase',
      icon: <AIIcon />,
      color: theme.palette.secondary.main
    }
  ];

  const mockTopPosts: TopPost[] = [
    {
      id: '1',
      title: 'Building a Social Network with React',
      views: 15420,
      likes: 892,
      comments: 234,
      shares: 156,
      engagement: 8.3,
      date: '2024-01-15'
    },
    {
      id: '2',
      title: 'Design Systems Best Practices',
      views: 12340,
      likes: 756,
      comments: 189,
      shares: 98,
      engagement: 8.5,
      date: '2024-01-12'
    },
    {
      id: '3',
      title: 'AI in Modern Web Development',
      views: 9870,
      likes: 634,
      comments: 145,
      shares: 87,
      engagement: 8.8,
      date: '2024-01-10'
    },
    {
      id: '4',
      title: 'TypeScript Tips and Tricks',
      views: 8760,
      likes: 523,
      comments: 123,
      shares: 76,
      engagement: 8.2,
      date: '2024-01-08'
    },
    {
      id: '5',
      title: 'Performance Optimization Techniques',
      views: 7650,
      likes: 445,
      comments: 98,
      shares: 65,
      engagement: 8.0,
      date: '2024-01-05'
    }
  ];

  const mockAudienceInsights: AudienceInsight[] = [
    {
      type: 'Peak Activity Time',
      value: '2-4 PM',
      description: 'Your audience is most active during these hours',
      trend: 'stable'
    },
    {
      type: 'Top Location',
      value: 'United States',
      description: '45% of your audience is from the US',
      trend: 'up'
    },
    {
      type: 'Age Group',
      value: '25-34',
      description: 'Your content resonates most with this age group',
      trend: 'stable'
    },
    {
      type: 'Device Usage',
      value: 'Mobile 68%',
      description: 'Most users access your content on mobile',
      trend: 'up'
    }
  ];

  const mockChartData: ChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Views',
        data: [1200, 1900, 3000, 5000, 2000, 3000, 4000],
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
        borderColor: theme.palette.primary.main
      },
      {
        label: 'Likes',
        data: [100, 150, 200, 300, 150, 200, 250],
        backgroundColor: alpha(theme.palette.error.main, 0.2),
        borderColor: theme.palette.error.main
      }
    ]
  };

  const handleTimeRangeChange = (event: any) => {
    setSelectedTimeRange(event.target.value);
    // In real app, this would trigger a new data fetch
  };

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const getChangeColor = (changeType: 'increase' | 'decrease' | 'stable' | 'up' | 'down') => {
    switch (changeType) {
      case 'increase':
      case 'up':
        return theme.palette.success.main;
      case 'decrease':
      case 'down':
        return theme.palette.error.main;
      case 'stable':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getChangeIcon = (changeType: 'increase' | 'decrease' | 'stable') => {
    switch (changeType) {
      case 'increase': return <TrendingIcon />;
      case 'decrease': return <TrendingDownIcon />;
      case 'stable': return <TimeIcon />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Analytics Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track your content performance and audience insights
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={selectedTimeRange}
              label="Time Range"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
              <MenuItem value="1y">Last year</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export data">
            <IconButton>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {mockMetrics.map((metric) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={metric.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      color: metric.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: alpha(metric.color, 0.1)
                    }}
                  >
                    {metric.icon}
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {getChangeIcon(metric.changeType)}
                      <Typography
                        variant="caption"
                        sx={{
                          color: getChangeColor(metric.changeType),
                          fontWeight: 600
                        }}
                      >
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {metric.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {metric.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Overview" />
          <Tab label="Top Posts" />
          <Tab label="Audience Insights" />
          <Tab label="Charts" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Engagement Over Time
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label="Views" size="small" color="primary" />
                    <Chip label="Likes" size="small" color="error" />
                  </Box>
                </Box>
                <Box
                  sx={{
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(theme.palette.grey[100], 0.5),
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <ChartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Chart Visualization
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Interactive charts showing engagement trends
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Quick Insights
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Best Performing Day
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                      Thursday
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      23% higher engagement than average
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Content Type Performance
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                      Tutorial Posts
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Generate 45% more engagement
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Growth Rate
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.warning.main }}>
                      +18.5%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Month-over-month follower growth
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Top Posts Tab */}
      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Top Performing Posts
            </Typography>
            <List>
              {mockTopPosts.map((post, index) => (
                <ListItem key={post.id} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: theme.palette.primary.main }}>
                      #{index + 1}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {post.title}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatNumber(post.views)} views
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatNumber(post.likes)} likes
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatNumber(post.comments)} comments
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatNumber(post.shares)} shares
                        </Typography>
                        <Chip
                          label={`${post.engagement}% engagement`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(post.date).toLocaleDateString()}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Audience Insights Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          {mockAudienceInsights.map((insight, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        color: getChangeColor(insight.trend),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: alpha(getChangeColor(insight.trend), 0.1)
                      }}
                    >
                      {insight.trend === 'up' ? <TrendingIcon /> : 
                       insight.trend === 'down' ? <TrendingDownIcon /> : <TimeIcon />}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {insight.type}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {insight.value}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {insight.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Charts Tab */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Engagement Trends
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(theme.palette.grey[100], 0.5),
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <LineChartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Line Chart
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Shows engagement trends over time
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Content Distribution
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(theme.palette.grey[100], 0.5),
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <PieChartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Pie Chart
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Shows content type distribution
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AnalyticsDashboard; 