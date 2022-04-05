import './App.scss';
import BagsPage from './components/bagsPage/bagsPage';
import BagPage from './components/bagPage/bagPage';
import {
  BrowserRouter,
  Switch,
  Route,
  Routes,
  Redirect
} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/bags" element={<BagsPage />}>
            </Route>
          </Routes>
          <Routes>
            <Route path="/bag/:id" element={<BagPage />}>
            </Route>
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
