import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { Check } from '@mui/icons-material';
import { useQuestionnaireStore } from '../contexts/QuestionnaireStore';

const DRAWER_WIDTH = 280;

interface SidebarProps {
  onViewReport: () => void;
  open: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const { sections, currentSectionIndex, goToSection, responses } =
    useQuestionnaireStore();

  const getSectionProgress = (sectionName: string): number => {
    const sectionResponses = responses[sectionName] || {};
    const answeredCount = Object.values(sectionResponses).filter(
      (val) => val !== undefined && val !== ''
    ).length;
    const section = sections.find((s) => s.name === sectionName);
    const totalQuestions = section?.questions.length || 0;
    return totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  };

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #667EEA 0%, #5A67D8 100%)',
          borderRight: 'none',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 3, mt: 8 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'white',
            mb: 1,
          }}
        >
          Onboarding Interview
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Complete all sections
        </Typography>
      </Box>

      <Divider />

      <List sx={{ pt: 2 }}>
        {sections.map((section, index) => {
          const progress = getSectionProgress(section.name);
          const isCompleted = progress === 100;
          const isCurrent = index === currentSectionIndex;

          return (
            <ListItem key={section.name} disablePadding>
              <ListItemButton
                selected={isCurrent}
                onClick={() => goToSection(index)}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <ListItemText
                    primary={section.name}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isCurrent ? 600 : 400,
                      color: 'white',
                    }}
                  />
                  {isCompleted && (
                    <Check
                      sx={{
                        fontSize: '1rem',
                        color: '#4ADE80',
                      }}
                    />
                  )}
                </Box>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};
