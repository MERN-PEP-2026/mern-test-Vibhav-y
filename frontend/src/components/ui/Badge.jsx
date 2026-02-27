import { cn } from '../../lib/cn';

const variantMap = {
  default: 'ui-badge ui-badge-default',
  secondary: 'ui-badge ui-badge-secondary',
  success: 'ui-badge ui-badge-success',
  warning: 'ui-badge ui-badge-warning'
};

const Badge = ({ variant = 'default', className, children }) => {
  return <span className={cn(variantMap[variant], className)}>{children}</span>;
};

export default Badge;
