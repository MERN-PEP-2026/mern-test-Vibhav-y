import { cn } from '../../lib/cn';

const variantMap = {
  default: 'ui-button ui-button-default',
  outline: 'ui-button ui-button-outline',
  ghost: 'ui-button ui-button-ghost',
  destructive: 'ui-button ui-button-destructive'
};

const sizeMap = {
  default: 'ui-button-size-default',
  sm: 'ui-button-size-sm',
  icon: 'ui-button-size-icon'
};

const Button = ({
  type = 'button',
  variant = 'default',
  size = 'default',
  className,
  children,
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(variantMap[variant], sizeMap[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
