import { ButtonProps, Button, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

interface GlassButtonProps extends ButtonProps {
  loading?: boolean;
  gradient?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  loading = false,
  gradient = true,
  disabled,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        {...props}
        disabled={disabled || loading}
        sx={{
          background: gradient ? theme.gradients.button : theme.colors.glass.background,
          backdropFilter: `blur(${theme.colors.glass.blur})`,
          border: `1px solid ${theme.colors.glass.border}`,
          boxShadow: `0 4px 16px 0 ${theme.colors.glass.shadow}`,
          color: gradient ? '#ffffff' : theme.colors.text.primary,
          fontWeight: 600,
          padding: '12px 32px',
          borderRadius: '12px',
          textTransform: 'none',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            background: gradient ? theme.gradients.button : theme.colors.glass.background,
            boxShadow: `0 8px 24px 0 ${theme.colors.primary}60`,
            transform: 'translateY(-2px)',
          },
          '&:disabled': {
            background: theme.colors.glass.background,
            color: theme.colors.text.disabled,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover::before': {
            left: '100%',
          },
          ...props.sx,
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
            {children}
          </>
        ) : (
          children
        )}
      </Button>
    </motion.div>
  );
};
