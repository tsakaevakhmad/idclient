import { TextField, TextFieldProps } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

export const GlassInput: React.FC<TextFieldProps> = (props) => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <TextField
        {...props}
        sx={{
          '& .MuiOutlinedInput-root': {
            background: theme.colors.glass.background,
            backdropFilter: `blur(${theme.colors.glass.blur})`,
            border: `1px solid ${theme.colors.glass.border}`,
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            '& fieldset': {
              border: 'none',
            },
            '&:hover': {
              background: `${theme.colors.glass.background}dd`,
              border: `1px solid ${theme.colors.primary}40`,
            },
            '&.Mui-focused': {
              background: `${theme.colors.glass.background}ee`,
              border: `1px solid ${theme.colors.primary}`,
              boxShadow: `0 0 20px ${theme.colors.primary}30`,
            },
          },
          '& .MuiInputLabel-root': {
            color: theme.colors.text.secondary,
            '&.Mui-focused': {
              color: theme.colors.primary,
            },
          },
          '& .MuiInputBase-input': {
            color: theme.colors.text.primary,
          },
          ...props.sx,
        }}
      />
    </motion.div>
  );
};
