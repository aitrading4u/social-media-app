import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  useTheme
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon
} from '@mui/icons-material';

interface TokenBalanceProps {
  balance: number;
  earned: number;
  spent: number;
  referralEarnings: number;
  onPurchase: () => void;
}

const TokenBalance: React.FC<TokenBalanceProps> = ({
  balance,
  earned,
  spent,
  referralEarnings,
  onPurchase
}) => {
  const theme = useTheme();

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 3
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountBalanceIcon />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Token Balance
          </Typography>
        </Box>
        <Chip
          label="TIPPER"
          sx={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontWeight: 'bold'
          }}
        />
      </Box>

      {/* Main Balance */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
          {formatNumber(balance)}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Available Tokens
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <TrendingUpIcon sx={{ fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {formatNumber(earned)}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Total Earned
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <ShoppingCartIcon sx={{ fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {formatNumber(spent)}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Total Spent
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Referral Earnings */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderRadius: 2, 
        mb: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PeopleIcon />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Referral Earnings
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              From your network
            </Typography>
          </Box>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {formatNumber(referralEarnings)}
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={onPurchase}
          sx={{
            backgroundColor: 'white',
            color: 'primary.main',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'grey.100'
            }
          }}
        >
          Buy Tokens
        </Button>
        
        <Button
          variant="outlined"
          fullWidth
          sx={{
            borderColor: 'white',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          Send Tokens
        </Button>
      </Box>
    </Paper>
  );
};

export default TokenBalance; 