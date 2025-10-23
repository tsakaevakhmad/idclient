import { ReactNode } from 'react';
import { Card, CardProps } from '@mui/material';
import { motion } from 'framer-motion';

interface AnimatedCardProps extends CardProps {
  children: ReactNode;
  delay?: number;
}

/**
 * Card component with entrance animation
 */
export const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, delay = 0, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <Card {...props}>{children}</Card>
    </motion.div>
  );
};
