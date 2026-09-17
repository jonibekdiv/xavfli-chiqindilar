// src/context/ConfirmContext.jsx
import { createContext, useCallback, useContext, useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    title: '',
    text: '',
    confirmText: 'OK',
    cancelText: 'Bekor',
    variant: 'info',
    hideCancel: false,
    resolve: null,
  });

  const confirm = useCallback((opts = {}) => {
    return new Promise((resolve) => {
      setState({
        open: true,
        title: opts.title || '',
        text: opts.text || '',
        confirmText: opts.confirmText || 'OK',
        cancelText: opts.cancelText || 'Bekor',
        variant: opts.variant || 'info',
        hideCancel: !!opts.hideCancel,
        resolve,
      });
    });
  }, []);

  const handleClose = (result) => {
    if (state.resolve) state.resolve(result);
    setState((s) => ({ ...s, open: false, resolve: null }));
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        open={state.open}
        title={state.title}
        text={state.text}
        confirmText={state.confirmText}
        cancelText={state.cancelText}
        variant={state.variant}
        hideCancel={state.hideCancel}
        onConfirm={() => handleClose(true)}
        onCancel={() => handleClose(false)}
      />
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm faqat ConfirmProvider ichida ishlaydi');
  return ctx;
}