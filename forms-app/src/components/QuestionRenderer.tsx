import React from 'react';
import {
  TextField,
  Switch,
  FormControlLabel,
  FormControl,
  RadioGroup,
  Radio,
  Box,
  Typography,
} from '@mui/material';
import type { Question } from '../types';

interface QuestionRendererProps {
  question: Question;
  value: string | boolean | undefined;
  onChange: (value: string | boolean) => void;
  error?: string;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            variant="outlined"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            error={!!error}
            helperText={error}
            placeholder="Your answer"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
              },
            }}
          />
        );

      case 'longtext':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            error={!!error}
            helperText={error}
            placeholder="Your answer"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
              },
            }}
          />
        );

      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!value}
                onChange={(e) => onChange(e.target.checked)}
                color="primary"
              />
            }
            label={value ? 'Yes' : 'No'}
          />
        );

      case 'options':
        return (
          <FormControl component="fieldset" error={!!error}>
            <RadioGroup
              value={(value as string) || ''}
              onChange={(e) => onChange(e.target.value)}
            >
              {question.options?.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {error && (
              <Typography color="error" variant="caption">
                {error}
              </Typography>
            )}
          </FormControl>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="body1"
        sx={{
          mb: 2,
          fontWeight: 500,
          color: 'text.primary',
          fontSize: '1rem',
        }}
      >
        {question.question}
        {question.required && (
          <Typography component="span" sx={{ ml: 0.5, color: '#FF6B9D' }}>
            *
          </Typography>
        )}
      </Typography>
      {renderInput()}
    </Box>
  );
};
