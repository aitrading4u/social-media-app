import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  Smartphone as SmartphoneIcon,
  Computer as ComputerIcon,
  Share as ShareIcon,
  Add as AddIcon,
  Home as HomeIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface InstallGuideProps {
  open: boolean;
  onClose: () => void;
}

const InstallGuide: React.FC<InstallGuideProps> = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      label: 'iPhone/iPad',
      content: (
        <Box>
          <Typography variant="body2" paragraph>
            To install Freedom Social on your iPhone or iPad:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <ShareIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Tap the Share button (square with arrow)" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Scroll down and tap 'Add to Home Screen'" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <HomeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Tap 'Add' to confirm" />
            </ListItem>
          </List>
        </Box>
      ),
    },
    {
      label: 'Android',
      content: (
        <Box>
          <Typography variant="body2" paragraph>
            To install Freedom Social on your Android device:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <ShareIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Tap the menu button (three dots)" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Tap 'Add to Home screen' or 'Install app'" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <HomeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Tap 'Add' to confirm" />
            </ListItem>
          </List>
        </Box>
      ),
    },
    {
      label: 'Desktop',
      content: (
        <Box>
          <Typography variant="body2" paragraph>
            To install Freedom Social on your desktop:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <AddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Look for the install button in your browser's address bar" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ComputerIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Click 'Install' to add to your desktop" />
            </ListItem>
          </List>
        </Box>
      ),
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Install Freedom Social</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" paragraph>
          Install Freedom Social on your device for quick access and offline functionality.
        </Typography>
        
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Box display="flex" alignItems="center" gap={1}>
                  {index === 0 && <SmartphoneIcon fontSize="small" />}
                  {index === 1 && <SmartphoneIcon fontSize="small" />}
                  {index === 2 && <ComputerIcon fontSize="small" />}
                  {step.label}
                </Box>
              </StepLabel>
              <StepContent>
                {step.content}
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === steps.length && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="success.main">
              All steps completed - you're ready to install!
            </Typography>
            <Button onClick={handleReset} sx={{ mt: 1 }}>
              Reset
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InstallGuide; 