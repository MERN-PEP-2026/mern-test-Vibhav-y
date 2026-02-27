import { cn } from '../../lib/cn';

const Input = ({ className, ...props }) => {
  return <input className={cn('ui-input', className)} {...props} />;
};

export default Input;
