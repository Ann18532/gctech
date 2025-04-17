import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ErpActions from './pages/ErpActions';
import PostLeave from './pages/PostLeave';
import GetLeave from './pages/GetLeave';
import PostLeaveForm from './pages/PostLeaveForm';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/erp/:provider" element={<ErpActions />} />
      <Route path="/erp/:provider/post" element={<PostLeave />} />
      <Route path="/erp/:provider/get" element={<GetLeave />} />
      <Route path="/erp/:provider/post/form" element={<PostLeaveForm />} />
    </Routes>
  );
}

export default App;
