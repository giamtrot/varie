import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProgramList from './ProgramList';
import ProgramDetail from './ProgramDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ProgramList />} />
          <Route path="/program/:programLink" element={<ProgramDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
