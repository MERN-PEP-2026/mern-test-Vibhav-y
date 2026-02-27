import { cn } from '../../lib/cn';

const Textarea = ({ className, ...props }) => {
  return <textarea className={cn('ui-textarea', className)} {...props} />;
};

export default Textarea;
