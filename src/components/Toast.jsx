import { useStore } from '../context/StoreContext';
import { Icon } from './Icons';

export default function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div className="toast" role="status" key={toast.key}>
      <Icon name="check" size={18} />
      <span>{toast.message}</span>
      {toast.action && (
        <button onClick={toast.action.onClick}>{toast.action.label}</button>
      )}
    </div>
  );
}
