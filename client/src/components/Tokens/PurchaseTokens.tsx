import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Divider
} from '@mui/material';
import {
  CreditCard,
  AccountBalance,
  CurrencyBitcoin,
  Payment,
  Close as CloseIcon
} from '@mui/icons-material';

interface PurchaseTokensProps {
  open: boolean;
  onClose: () => void;
  onPurchase: (amount: number, currency: string, paymentMethod: string) => void;
}

const PurchaseTokens: React.FC<PurchaseTokensProps> = ({
  open,
  onClose,
  onPurchase
}) => {
  const [amount, setAmount] = useState(50);
  const [currency, setCurrency] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [isLoading, setIsLoading] = useState(false);

  const presetAmounts = [20, 50, 100, 200, 500, 1000];
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'BTC', symbol: '₿', name: 'Bitcoin' },
    { code: 'ETH', symbol: 'Ξ', name: 'Ethereum' },
    { code: 'USDT', symbol: '₮', name: 'Tether' },
    { code: 'USDC', symbol: '₮', name: 'USD Coin' }
  ];

  const paymentMethods = [
    { id: 'stripe', name: 'Credit Card', icon: <CreditCard />, description: 'Visa, Mastercard, American Express' },
    { id: 'paypal', name: 'PayPal', icon: <Payment />, description: 'PayPal account or credit card' },
    { id: 'bank', name: 'Bank Transfer', icon: <AccountBalance />, description: 'Direct bank transfer' },
    { id: 'crypto', name: 'Cryptocurrency', icon: <CurrencyBitcoin />, description: 'Bitcoin, Ethereum, USDT' }
  ];

  const getExchangeRate = (curr: string) => {
    // Mock exchange rates - in real app, fetch from API
    const rates: { [key: string]: number } = {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      BTC: 0.000023,
      ETH: 0.00035,
      USDT: 1,
      USDC: 1
    };
    return rates[curr] || 1;
  };

  const getPriceInCurrency = (tokenAmount: number, curr: string) => {
    const rate = getExchangeRate(curr);
    return (tokenAmount * rate).toFixed(2);
  };

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      await onPurchase(amount, currency, paymentMethod);
      onClose();
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Purchase Tokens
          </Typography>
          <Button onClick={onClose} startIcon={<CloseIcon />}>
            Close
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Token Amount Selection */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              How many tokens?
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {presetAmounts.map((preset) => (
                  <Chip
                    key={preset}
                    label={`${preset} 🪙`}
                    onClick={() => setAmount(preset)}
                    sx={{
                      backgroundColor: amount === preset ? '#667eea' : '#f0f0f0',
                      color: amount === preset ? 'white' : 'inherit',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: amount === preset ? '#5a6fd8' : '#e0e0e0'
                      }
                    }}
                  />
                ))}
              </Box>
              
              <TextField
                fullWidth
                type="number"
                label="Custom Amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                inputProps={{ min: 1, max: 10000 }}
              />
            </Box>

            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textAlign: 'center'
            }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {amount} 🪙
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                You'll receive {amount} tokens instantly
              </Typography>
            </Box>
          </Grid>

          {/* Payment Options */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>

            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                {paymentMethods.map((method) => (
                  <FormControlLabel
                    key={method.id}
                    value={method.id}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {method.icon}
                        <Box>
                          <Typography variant="subtitle1">{method.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {method.description}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ 
                      mb: 1,
                      p: 1,
                      borderRadius: 1,
                      border: paymentMethod === method.id ? '2px solid #667eea' : '1px solid #e0e0e0'
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Currency
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Currency</InputLabel>
              <Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                label="Select Currency"
              >
                {currencies.map((curr) => (
                  <MenuItem key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.name} ({curr.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ 
              p: 2, 
              borderRadius: 1, 
              backgroundColor: '#f8f9fa',
              textAlign: 'center'
            }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                Total: {getPriceInCurrency(amount, currency)} {currency}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Exchange rate: 1 🪙 = {getExchangeRate(currency)} {currency}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Benefits */}
        <Box sx={{ mt: 3, p: 2, borderRadius: 2, backgroundColor: '#e8f5e8' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
            🎉 Benefits of Tokens
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                💝 Tip creators and show appreciation
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                🚀 Support content you love
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                💰 Withdraw to USD or crypto
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                🎁 Earn tokens through referrals
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handlePurchase}
          disabled={amount <= 0 || isLoading}
          size="large"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
            }
          }}
        >
          {isLoading ? 'Processing...' : `Purchase ${amount} Tokens`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseTokens; 