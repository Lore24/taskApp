import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm'} size="sm">
      <p className="text-content-secondary mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm font-medium text-content-secondary bg-surface-tertiary hover:bg-surface-tertiary/80 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-accent-rose hover:bg-accent-rose/80 transition-colors"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
