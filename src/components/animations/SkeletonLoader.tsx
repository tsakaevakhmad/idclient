import { Box, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

interface SkeletonLoaderProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | false;
}

export const GlassSkeleton: React.FC<SkeletonLoaderProps> = ({
  variant = 'rectangular',
  width = '100%',
  height = 40,
  animation = 'wave',
}) => {
  const { theme } = useTheme();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <Skeleton
        variant={variant}
        width={width}
        height={height}
        animation={animation}
        sx={{
          background: theme.colors.glass.background,
          backdropFilter: `blur(${theme.colors.glass.blur})`,
          border: `1px solid ${theme.colors.glass.border}`,
          '&::after': {
            background: `linear-gradient(90deg, transparent, ${theme.colors.primary}20, transparent)`,
          },
        }}
      />
    </motion.div>
  );
};

export const ProfileSkeletonLoader: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        p: 4,
      }}
    >
      <GlassSkeleton variant="circular" width={96} height={96} />
      <GlassSkeleton width={200} height={32} />
      <GlassSkeleton width={150} height={24} />
      <Box sx={{ width: '100%', mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <GlassSkeleton height={60} />
        <GlassSkeleton height={60} />
        <GlassSkeleton height={60} />
      </Box>
    </Box>
  );
};
