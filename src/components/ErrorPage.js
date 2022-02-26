import propTypes from 'prop-types';
import CloseButton from './CloseButton';

const styles = {
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'auto',
    padding: '30px',
  },
  inner: {
    padding: '50px',
    minWidth: '350px',
    border: '1px solid #eee',
    borderRadius: '5px',
    boxShadow: '2px 0 8px 14px #eee',
    color: 'red',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  btn: {
    position: 'absolute',
    top: '10px',
    right: '10px',
  },
};

const ErrorPage = ({ error, onClose }) => (
  <section style={styles.container}>
    <div style={styles.inner}>
      {error}
    </div>
    {onClose && <CloseButton onClose={onClose} />}
  </section>
);

ErrorPage.propTypes = {
  error: propTypes.string.isRequired,
  onClose: propTypes.func,
};

ErrorPage.defaultProps = {
  onClose: null,
};

export default ErrorPage;
