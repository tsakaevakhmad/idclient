import { ReactNode, CSSProperties } from 'react';
import { Card, CardProps } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

interface GlassCardProps extends Omit<CardProps, 'children'> {
  children: ReactNode;
  hover?: boolean;
  glowOnHover?: boolean;
  style?: CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  hover = true,
  glowOnHover = false,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  const hoverStyles = hover
    ? {
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 48px 0 ${theme.colors.glass.shadow}`,
          backdropFilter: `blur(${parseInt(theme.colors.glass.blur) + 4}px)`,
          ...(glowOnHover && {
            border: `1px solid ${theme.colors.primary}`,
            boxShadow: `0 0 30px ${theme.colors.primary}40`,
          }),
        },
      }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={hover ? { scale: 1.02 } : {}}
    >
      <Card
        {...props}
        sx={{
          background: theme.colors.glass.background,
          backdropFilter: `blur(${theme.colors.glass.blur})`,
          border: `1px solid ${theme.colors.glass.border}`,
          boxShadow: `0 8px 32px 0 ${theme.colors.glass.shadow}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          ...hoverStyles,
          ...props.sx,
        }}
        style={style}
      >
        {children}
      </Card>
    </motion.div>
  );
};
