import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const nextLabel = theme === 'dark' ? 'Light' : 'Dark';

  return (
    <Button variant="outline" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
      {nextLabel} mode
    </Button>
  );
};

export default ThemeToggle;
