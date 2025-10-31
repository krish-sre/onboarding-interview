import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Paper,
} from '@mui/material';
import { Close, GetApp } from '@mui/icons-material';
import type { FinalResponse, QuestionnaireData, Question } from '../types';

interface ReportViewerProps {
  open: boolean;
  onClose: () => void;
  data: FinalResponse;
  questionnaireData: QuestionnaireData | null;
  isSubmitted?: boolean;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  open,
  onClose,
  data,
  questionnaireData,
  isSubmitted = false,
}) => {
  const formatValue = (value: string | boolean): string => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value || 'Not answered';
  };

  const getQuestionText = (sectionName: string, questionId: string): string => {
    if (!questionnaireData) return questionId;
    const section = questionnaireData[sectionName];
    if (!section) return questionId;
    const question = section.find((q: Question) => q.id === questionId);
    return question ? question.question : questionId;
  };

  const downloadMarkdown = () => {
    let markdown = `# Submission Report\n\n`;
    markdown += `**Version:** ${data.version}\n\n`;
    markdown += `**Date:** ${data.date}\n\n`;
    markdown += `---\n\n`;

    Object.entries(data.responses).forEach(([sectionName, questions]) => {
      markdown += `## ${sectionName}\n\n`;
      
      Object.entries(questions).forEach(([questionId, answer]) => {
        const questionText = getQuestionText(sectionName, questionId);
        markdown += `**${questionText}**\n\n`;
        markdown += `${formatValue(answer)}\n\n`;
      });
      
      markdown += `---\n\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `submission_report_${data.date}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#faf9f8',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(90deg, #5B47D1 0%, #7B66E8 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
          Submission Report
        </Typography>
        <Button
          onClick={onClose}
          sx={{ color: 'white', minWidth: 'auto' }}
          endIcon={<Close />}
        >
          Close
        </Button>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Version: {data.version}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Date: {data.date}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {Object.entries(data.responses).map(([sectionName, questions]) => (
          <Paper
            key={sectionName}
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              backgroundColor: 'white',
              border: '1px solid #edebe9',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: 'text.primary',
                borderBottom: '2px solid',
                borderImage: 'linear-gradient(90deg, #5B47D1, #FF6B9D) 1',
                pb: 1,
              }}
            >
              {sectionName}
            </Typography>

            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              {Object.entries(questions).map(([questionId, answer]) => (
                <Box
                  component="li"
                  key={questionId}
                  sx={{
                    mb: 2,
                    listStyle: 'none',
                    position: 'relative',
                    pl: 2,
                    '&::before': {
                      content: '"•"',
                      position: 'absolute',
                      left: 0,
                      color: '#5B47D1',
                      fontWeight: 'bold',
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: '#605e5c', mb: 0.5 }}
                  >
                    {getQuestionText(sectionName, questionId)}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#323130',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {formatValue(answer)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        ))}
      </DialogContent>

      {isSubmitted && (
        <DialogActions sx={{ p: 2, backgroundColor: '#F5F7FA' }}>
          <Button
            variant="contained"
            startIcon={<GetApp />}
            onClick={downloadMarkdown}
            sx={{
              background: 'linear-gradient(90deg, #5B47D1 0%, #7B66E8 100%)',
              '&:hover': {
                background: 'linear-gradient(90deg, #4436A8 0%, #5B47D1 100%)',
              },
            }}
          >
            Download Report
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
