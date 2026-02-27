import ThemeToggle from './ThemeToggle';

const AppHeader = ({ rightContent }) => {
  return (
    <header className="app-header">
      <div className="brand">TaskFlow</div>
      <div className="header-actions">
        <ThemeToggle />
        {rightContent}
      </div>
    </header>
  );
};

export default AppHeader;
