import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  IconButton,
  Chip,
  Avatar,
  useTheme,
  alpha,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Favorite as TipIcon,
  Close as CloseIcon,
  Star as StarIcon,
  EmojiEmotions as EmojiIcon,
  Celebration as CelebrationIcon,
  LocalFireDepartment as FireIcon,

} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';

interface TipButtonProps {
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  onTipSent?: (amount: number, message: string) => void;
}

interface TipOption {
  id: string;
  amount: number;
  label: string;
  icon: React.ReactNode;
  color: string;
  popular?: boolean;
}

const TipButton: React.FC<TipButtonProps> = ({
  recipientId,
  recipientName,
  recipientAvatar,
  onTipSent
}) => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState('');
  const [tipMessage, setTipMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // Mock user token balance
  const userTokenBalance = 1500;

  const tipOptions: TipOption[] = [
    {
      id: 'small',
      amount: 10,
      label: 'Small Tip',
      icon: <EmojiIcon />,
      color: '#4CAF50'
    },
    {
      id: 'medium',
      amount: 50,
      label: 'Medium Tip',
      icon: <StarIcon />,
      color: '#FF9800',
      popular: true
    },
    {
      id: 'large',
      amount: 100,
      label: 'Large Tip',
      icon: <CelebrationIcon />,
      color: '#E91E63'
    },
    {
      id: 'huge',
      amount: 500,
      label: 'Huge Tip',
      icon: <FireIcon />,
      color: '#FF5722'
    },

  ];

  const handleOpen = () => {
    setOpen(true);
    setSelectedAmount(0);
    setCustomAmount('');
    setTipMessage('');
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(0);
  };

  const getFinalAmount = (): number => {
    if (customAmount) {
      const amount = parseInt(customAmount);
      return isNaN(amount) ? 0 : amount;
    }
    return selectedAmount;
  };

  const handleSendTip = async () => {
    const amount = getFinalAmount();
    
    if (amount <= 0) {
      showSnackbar('Please select a valid amount', 'error');
      return;
    }

    if (amount > userTokenBalance) {
      showSnackbar('Insufficient token balance', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock tip data
      const tipData = {
        id: Math.random().toString(36).substr(2, 9),
        senderId: user?.id || '1',
        senderName: user?.displayName || 'Demo User',
        recipientId,
        recipientName,
        amount,
        message: tipMessage,
        timestamp: new Date()
      };

      console.log('Tip sent:', tipData);
      onTipSent?.(amount, tipMessage);
      showSnackbar(`Tip of ${amount} tokens sent to ${recipientName}!`, 'success');
      handleClose();
    } catch (error) {
      console.error('Error sending tip:', error);
      showSnackbar('Error sending tip. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const formatTokens = (amount: number) => {
    return `${amount} tokens`;
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<TipIcon />}
        onClick={handleOpen}
        sx={{
          backgroundColor: theme.palette.secondary.main,
          color: 'white',
          '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
            transform: 'scale(1.05)'
          },
          transition: 'all 0.2s ease-in-out',
          borderRadius: 2,
          px: 3
        }}
      >
        Tip Creator
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
              Send Tip to {recipientName}
            </Typography>
            <IconButton onClick={handleClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 0 }}>
          {/* Recipient Info */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 3,
            p: 2,
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 2
          }}>
            <Avatar 
              src={recipientAvatar} 
              sx={{ width: 56, height: 56, border: '3px solid white' }}
            >
              {recipientName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                {recipientName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Show your appreciation with a tip!
              </Typography>
            </Box>
          </Box>

          {/* Token Balance */}
          <Box sx={{ 
            mb: 3,
            p: 2,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: 2,
            textAlign: 'center'
          }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Your Token Balance
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              {formatTokens(userTokenBalance)}
            </Typography>
          </Box>

          {/* Tip Amount Options */}
          <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 600 }}>
            Select Tip Amount
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {tipOptions.map((option) => (
              <Grid item xs={6} sm={4} key={option.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: selectedAmount === option.amount ? `3px solid ${option.color}` : 'none',
                    backgroundColor: selectedAmount === option.amount ? alpha(option.color, 0.1) : 'white',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4]
                    },
                    transition: 'all 0.2s ease-in-out',
                    position: 'relative'
                  }}
                  onClick={() => handleAmountSelect(option.amount)}
                >
                  {option.popular && (
                    <Chip
                      label="Popular"
                      size="small"
                      color="primary"
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        fontSize: '0.7rem'
                      }}
                    />
                  )}
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Box sx={{ color: option.color, mb: 1 }}>
                      {option.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {formatTokens(option.amount)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Custom Amount */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, color: 'white', fontWeight: 600 }}>
              Or enter custom amount
            </Typography>
            <TextField
              fullWidth
              type="number"
              placeholder="Enter amount in tokens"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: 'white'
                  }
                }
              }}
            />
          </Box>

          {/* Tip Message */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, color: 'white', fontWeight: 600 }}>
              Add a message (optional)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Write a message to accompany your tip..."
              value={tipMessage}
              onChange={(e) => setTipMessage(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: 'white'
                  }
                }
              }}
            />
          </Box>

          {/* Summary */}
          {getFinalAmount() > 0 && (
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'rgba(255,255,255,0.9)', 
              borderRadius: 2,
              textAlign: 'center'
            }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Tip Summary
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                {formatTokens(getFinalAmount())}
              </Typography>
              {tipMessage && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  "{tipMessage}"
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleClose}
            sx={{ 
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSendTip}
            disabled={getFinalAmount() <= 0 || getFinalAmount() > userTokenBalance || isProcessing}
            startIcon={isProcessing ? <CircularProgress size={16} /> : <TipIcon />}
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark
              },
              '&:disabled': {
                backgroundColor: 'rgba(255,255,255,0.3)',
                color: 'rgba(255,255,255,0.5)'
              }
            }}
          >
            {isProcessing ? 'Sending...' : `Send ${formatTokens(getFinalAmount())}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
    </>
  );
};

export default TipButton; 