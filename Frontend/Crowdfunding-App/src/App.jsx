import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import ViewProjects from './components/ViewProjects';
import EditProject from './components/EditProject';
import './App.css';
import CreateProject from './pages/CreateProject';
import MyProjects from './components/MyProjects';

function App() {
  return (
    <Router>
      <div className="App" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh'
      }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/view-projects" element={<ViewProjects/>} />
          <Route path="/edit/:projectId" element={<EditProject />} />
          <Route path="/my-projects" element={<MyProjects />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
