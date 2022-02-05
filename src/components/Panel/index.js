import { useState } from 'react';
import LoginPage from '../LoginPage';

const Panel = () => {
  const [user, setUser] = useState(null);
  //  const [notes, setNotes] = useState(null);

  if (!user) return <LoginPage setUser={setUser} />;

  return <h2>Panel</h2>;
};

export default Panel;
