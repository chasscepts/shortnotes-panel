import { Provider } from './redux';
import store from './app/store';
import LandingPage from './components/LandingPage';

const App = () => (
  <Provider store={store}>
    <LandingPage />
  </Provider>
);

export default App;
