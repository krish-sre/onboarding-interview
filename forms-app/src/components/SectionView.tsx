import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Paper,
} from '@mui/material';
import { NavigateNext, NavigateBefore } from '@mui/icons-material';
import { QuestionRenderer } from './QuestionRenderer';
import { useQuestionnaireStore } from '../contexts/QuestionnaireStore';

export const SectionView: React.FC = () => {
  const {
    sections,
    currentSectionIndex,
    responses,
    setResponse,
    nextSection,
    previousSection,
  } = useQuestionnaireStore();

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSectionIndex]);

  if (sections.length === 0) {
    return null;
  }

  const currentSection = sections[currentSectionIndex];
  const progress = ((currentSectionIndex + 1) / sections.length) * 100;
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === sections.length - 1;

  return (
    <Box>
      {/* Progress Bar */}
      <Box sx={{ mb: 4 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: '#E2E8F0',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #5B47D1 0%, #7B66E8 100%)',
              borderRadius: 5,
            },
          }}
        />
        <Typography
          variant="caption"
          sx={{ mt: 1, display: 'block', color: 'text.secondary', fontWeight: 500 }}
        >
          Section {currentSectionIndex + 1} of {sections.length}
        </Typography>
      </Box>

      {/* Section Content */}
      <Paper
        elevation={2}
        sx={{
          p: 5,
          backgroundColor: 'background.paper',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(91, 71, 209, 0.08)',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            fontWeight: 600,
            color: 'text.primary',
            borderBottom: '3px solid',
            borderImage: 'linear-gradient(90deg, #5B47D1, #FF6B9D) 1',
            pb: 2,
          }}
        >
          {currentSection.name}
        </Typography>

        {/* Questions */}
        {currentSection.questions.map((question) => (
          <QuestionRenderer
            key={question.id}
            question={question}
            value={responses[currentSection.name]?.[question.id]}
            onChange={(value) =>
              setResponse(currentSection.name, question.id, value)
            }
          />
        ))}
      </Paper>

      {/* Navigation Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 4,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<NavigateBefore />}
          onClick={previousSection}
          disabled={isFirstSection}
          size="large"
          sx={{
            borderColor: 'primary.main',
            color: 'primary.main',
            px: 3,
            '&:hover': {
              borderColor: 'primary.dark',
              backgroundColor: 'rgba(91, 71, 209, 0.04)',
            },
          }}
        >
          Previous
        </Button>

        <Button
          variant="contained"
          endIcon={<NavigateNext />}
          onClick={nextSection}
          disabled={isLastSection}
          size="large"
          sx={{
            background: 'linear-gradient(90deg, #5B47D1 0%, #7B66E8 100%)',
            px: 4,
            '&:hover': {
              background: 'linear-gradient(90deg, #4436A8 0%, #5B47D1 100%)',
            },
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};
