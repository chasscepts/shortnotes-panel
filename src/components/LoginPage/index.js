import { useState } from 'react';
import PropTypes from 'prop-types';
import style from './style.module.css';
import mb from '../../assets/css/mobileInput.module.css';
import LoadingButton from '../LoadingButton';
import { login } from '../../api';

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassord] = useState('');
  const [state, setState] = useState({ error: null, busy: false });

  const handleTextChange = ({ target: { name, value } }) => {
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassord(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      setState({ error: state.error, busy: true });
      login({ email, password })
        .then((user) => setUser(user))
        .catch((err) => setState({ error: err.message, busy: false }));
    }
  };

  return (
    <div className={`${style.container} container`}>
      <form className={style.innerWrap} onSubmit={handleSubmit}>
        <h2 className={style.h2}>Sign In</h2>
        {state.error && <div className={style.error}>{state.error}</div>}
        <input className={mb.text} type="text" name="email" value={email} placeholder="Enter Email" onChange={handleTextChange} />
        <input className={mb.text} type="password" name="password" value={password} placeholder="Enter Password" onChange={handleTextChange} />
        <LoadingButton type="submit" label="Log In" loading={state.busy} />
      </form>
    </div>
  );
};

LoginPage.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default LoginPage;
