import './App.css';
import BagsPage from './components/bagsPage/bagsPage';
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
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
