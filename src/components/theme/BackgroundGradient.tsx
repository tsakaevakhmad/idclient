import { useTheme } from '../../hooks/useTheme';

export const BackgroundGradient: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        background: theme.colors.background.main,
      }}
    />
  );
};
