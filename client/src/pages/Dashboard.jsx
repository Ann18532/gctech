import './Dashboard.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';




//dev -> real 
//mock-connect -> connect
function Dashboard() {
  const navigate = useNavigate();

  const mockConnectERP = async (provider) => {
    console.log(`🔌 Simulating connection for ${provider.toUpperCase()}`);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/integration/mock-connect',
        { provider },
        { withCredentials: true }
      );

      console.log(`✅ ERP ${provider} connected:`, res.data);
      navigate(`/erp/${provider}`);
    } catch (err) {
      console.error(`❌ Error simulating connection for ${provider}`, err);
      alert(`Connection failed for ${provider.toUpperCase()}`);
    }
  };
  
  // <Navbar />
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Connect Your ERP System</h1>
      <div className="erp-grid">
        {['oracle', 'sap', 'bamboohr'].map(provider => (
          <div className="erp-card" key={provider}>
            <img className="erp-logo" src={`/${provider}.png`} alt={provider} />
            <h2>{provider.toUpperCase()}</h2>
            <p>Connect to {provider.toUpperCase()} to manage leave requests.</p>
            <button onClick={async () => await mockConnectERP(provider)}>
              🔗 Connect {provider.toUpperCase()}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
