import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import ProgramList from './ProgramList';
import ProgramDetail from './ProgramDetail';
import Review from './Review';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<ProgramList />} />
            <Route path="/program/:programLink" element={<ProgramDetail />} />
            <Route path="/review" element={<Review />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
