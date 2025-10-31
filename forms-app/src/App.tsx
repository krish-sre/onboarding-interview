import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Alert,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SectionView } from './components/SectionView';
import { ReportViewer } from './components/ReportViewer';
import { useQuestionnaireStore } from './contexts/QuestionnaireStore';
import { downloadJSON } from './utils/storage';
import type { FinalResponse } from './types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5B47D1',
      light: '#7B66E8',
      dark: '#4436A8',
    },
    secondary: {
      main: '#FF6B9D',
      light: '#FF8FB3',
      dark: '#E6447A',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D3748',
      secondary: '#718096',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
  },
});

const DRAWER_WIDTH = 280;

function App() {
  const { loadQuestionnaire, isLoading, error, getFinalResponse, questionnaireData } =
    useQuestionnaireStore();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportData, setReportData] = useState<FinalResponse | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadQuestionnaire();
  }, [loadQuestionnaire]);

  const handleSubmit = () => {
    const finalResponse = getFinalResponse();
    downloadJSON(finalResponse, 'final_response.json');
    setReportData(finalResponse);
    setIsSubmitted(true);
    setReportOpen(true);
    alert('Form submitted successfully! Your response has been downloaded.');
  };

  const handleViewReport = () => {
    const finalResponse = getFinalResponse();
    setReportData(finalResponse);
    setReportOpen(true);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseReport = () => {
    setReportOpen(false);
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Header 
          onSubmit={handleSubmit} 
          onViewReport={handleViewReport}
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />
        <Sidebar 
          onViewReport={handleViewReport}
          open={sidebarOpen}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            minHeight: '100vh',
            width: sidebarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
            marginLeft: sidebarOpen ? `${DRAWER_WIDTH}px` : 0,
            transition: theme.transitions.create(['margin-left', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            pt: 10,
            pb: 4,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '900px',
              px: 4,
            }}
          >
            <SectionView />
          </Box>
        </Box>
      </Box>

      {reportData && (
        <ReportViewer
          open={reportOpen}
          onClose={handleCloseReport}
          data={reportData}
          questionnaireData={questionnaireData}
          isSubmitted={isSubmitted}
        />
      )}
    </ThemeProvider>
  );
}

export default App;
