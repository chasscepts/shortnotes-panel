import propTypes from 'prop-types';

const styles = {
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))',
  },
  dim: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
    background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))',
  },
  inner: {
    padding: '20px',
    maxWidth: '400px',
    border: '1px solid #eee',
    borderRadius: '5px',
    boxShadow: '2px 0 8px 14px rgba(0, 0, 0, 0.3)',
    backgroundColor: '#fff',
    color: '#666',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  controls: {
    padding: '20px 0 0',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  btn: {
    margin: '0 0 0 15px',
    backgroundColor: '#62b5e5',
    color: '#fff',
    fontSize: '0.8rem',
    padding: '5px 10px',
    fontWeight: 'bold',
  },
};

const ConfirmDialog = ({
  message,
  onFeedback,
  confirmLabel,
  cancelLabel,
}) => {
  const confirm = () => onFeedback(true);
  const cancel = () => onFeedback(false);

  return (
    <section style={styles.container}>
      <div style={styles.inner}>
        <div><pre>{message}</pre></div>
        <div style={styles.controls}>
          <button type="button" style={styles.btn} onClick={confirm}>{confirmLabel}</button>
          <button type="button" style={styles.btn} onClick={cancel}>{cancelLabel}</button>
        </div>
      </div>
    </section>
  );
};

ConfirmDialog.propTypes = {
  message: propTypes.string.isRequired,
  onFeedback: propTypes.func.isRequired,
  confirmLabel: propTypes.string,
  cancelLabel: propTypes.string,
};

ConfirmDialog.defaultProps = {
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
};

export default ConfirmDialog;
