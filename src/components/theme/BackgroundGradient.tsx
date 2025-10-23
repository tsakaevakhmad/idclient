import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

export const BackgroundGradient: React.FC = () => {
  const { theme } = useTheme();
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number }>
  >([]);

  useEffect(() => {
    // Generate random floating particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 200 + 100,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: 'hidden',
        background: theme.gradients.background,
      }}
    >
      {/* Animated gradient overlay */}
      <motion.div
        animate={{
          background: [
            theme.gradients.background,
            `linear-gradient(135deg, ${theme.colors.primary}40 0%, ${theme.colors.secondary}40 100%)`,
            theme.gradients.background,
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.3,
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.colors.primary}30 0%, transparent 70%)`,
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(${theme.colors.glass.border} 1px, transparent 1px),
            linear-gradient(90deg, ${theme.colors.glass.border} 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.1,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
