import { cn } from '../../lib/cn';

export const Card = ({ className, children }) => {
  return <section className={cn('ui-card', className)}>{children}</section>;
};

export const CardHeader = ({ className, children }) => {
  return <header className={cn('ui-card-header', className)}>{children}</header>;
};

export const CardTitle = ({ className, children }) => {
  return <h2 className={cn('ui-card-title', className)}>{children}</h2>;
};

export const CardDescription = ({ className, children }) => {
  return <p className={cn('ui-card-description', className)}>{children}</p>;
};

export const CardContent = ({ className, children }) => {
  return <div className={cn('ui-card-content', className)}>{children}</div>;
};

export const CardFooter = ({ className, children }) => {
  return <footer className={cn('ui-card-footer', className)}>{children}</footer>;
};
