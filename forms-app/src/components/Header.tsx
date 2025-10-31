import React, { useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Save,
  CloudUpload,
  Send,
  MoreVert,
  GetApp,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useQuestionnaireStore } from '../contexts/QuestionnaireStore';
import { downloadJSON, uploadJSON } from '../utils/storage';

interface HeaderProps {
  onSubmit: () => void;
  onViewReport: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onSubmit, onViewReport, onToggleSidebar }) => {
  const { responses, importResponses, saveProgress, clearProgress } =
    useQuestionnaireStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleSaveProgress = () => {
    saveProgress();
    const tempResponse = responses;
    downloadJSON(tempResponse, 'temp_response.json');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const data = await uploadJSON(file);
        importResponses(data);
        alert('Progress loaded successfully!');
      } catch (error) {
        alert('Failed to load file. Please ensure it is a valid JSON file.');
      }
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClearProgress = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all progress? This cannot be undone.'
      )
    ) {
      clearProgress();
      handleMenuClose();
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid #E2E8F0',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <IconButton
          edge="start"
          onClick={onToggleSidebar}
          sx={{ mr: 2, color: 'primary.main' }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            background: 'linear-gradient(90deg, #5B47D1 0%, #FF6B9D 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          SRE - Onboarding Questionnaire
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Save />}
            onClick={handleSaveProgress}
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'rgba(91, 71, 209, 0.04)',
              },
            }}
          >
            Save Progress
          </Button>

          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            onClick={handleUploadClick}
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'rgba(91, 71, 209, 0.04)',
              },
            }}
          >
            Load Progress
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />

          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={onViewReport}
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'rgba(91, 71, 209, 0.04)',
              },
            }}
          >
            View Report
          </Button>

          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={onSubmit}
            sx={{
              background: 'linear-gradient(90deg, #667EEA 0%, #5A67D8 100%)',
              '&:hover': {
                background: 'linear-gradient(90deg, #5A67D8 0%, #4C51BF 100%)',
              },
            }}
          >
            Submit
          </Button>

          <IconButton onClick={handleMenuOpen} sx={{ color: 'primary.main' }}>
            <MoreVert />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleClearProgress}>Clear All Progress</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
