import './App.scss';
import Navbar from './components/Navbar/Navbar';
import BagsPage from './components/bagsPage/bagsPage';
import BagPage from './components/bagPage/bagPage';
import LoginPage from './components/loginPage/loginPage';
import RegistrationPage from './components/registrationPage/registrationPage';
import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom';

function App() {
  return (
    <div>
      <header>
        <Navbar />
        <BrowserRouter>
          <Routes>
            <Route path='/bags' element={<BagsPage />}></Route>
            <Route path='/bags/:id' element={<BagPage />}></Route>
            <Route path='/login' element={<LoginPage />}></Route>
            <Route path='/register' element={<RegistrationPage />}></Route>
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
