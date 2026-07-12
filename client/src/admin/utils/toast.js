import { toast } from 'react-toastify';

const toastConfig = {
  position: 'bottom-center',
  autoClose: 3500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  style: {
    background: '#1E1E1B', // Brand Dark
    color: '#FCFBF8', // Brand Linen
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    borderRadius: '8px',
    border: '0.5px solid #ECE7DF', // Brand Border
    padding: '12px 24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  }
};

export const adminToast = {
  success: (msg) => toast.success(msg, toastConfig),
  error: (msg) => toast.error(msg, toastConfig),
  info: (msg) => toast.info(msg, toastConfig),
  warn: (msg) => toast.warn(msg, toastConfig)
};

export default adminToast;
