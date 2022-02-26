import { useState } from 'react';
import style from './style.module.css';
import mb from '../../assets/css/mobileInput.module.css';
import LoadingButton from '../LoadingButton';
import { useDispatch, useSelector } from '../../redux';
import { loginAsync, selectIsLoggingIn, selectUserError } from '../../app/reducers/userSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassord] = useState('');
  const error = useSelector(selectUserError);
  const busy = useSelector(selectIsLoggingIn);
  const dispatch = useDispatch();

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
      dispatch(loginAsync(email, password));
    }
  };

  return (
    <div className={`${style.container} container`}>
      <form className={style.innerWrap} onSubmit={handleSubmit}>
        <h2 className={style.h2}>Sign In</h2>
        {error && <div className={style.error}>{error}</div>}
        <input className={mb.text} type="text" name="email" value={email} placeholder="Enter Email" onChange={handleTextChange} />
        <input className={mb.text} type="password" name="password" value={password} placeholder="Enter Password" onChange={handleTextChange} />
        <LoadingButton type="submit" label="Log In" loading={busy} />
      </form>
    </div>
  );
};

export default LoginPage;
