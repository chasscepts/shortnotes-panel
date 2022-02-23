import propTypes from 'prop-types';

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
};

const ErrorPage = ({ error }) => (
  <section style={styles.container}>
    <div style={styles.inner}>
      {error}
    </div>
  </section>
);

ErrorPage.propTypes = {
  error: propTypes.string.isRequired,
};

export default ErrorPage;
