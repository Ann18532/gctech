import { useNavigate, useParams } from 'react-router-dom';
import './ErpActions.css';
import Navbar from '../components/Navbar.jsx';


function ErpActions() {
  const { provider } = useParams();
  const navigate = useNavigate();

  const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);

  return (
    <>
    <Navbar />
    <div className="erp-action-container">
      <h1>{providerName} Leave Management</h1>
      <div className="erp-action-grid">
        <div className="erp-action-card" onClick={() => navigate(`/erp/${provider}/post`)}>
          <h2>➕ Post Leave Request</h2>
          <p>Submit a new leave for an employee using your universal API.</p>
        </div>
        <div className="erp-action-card" onClick={() => navigate(`/erp/${provider}/get`)}>
          <h2>📄 Get Leave Details</h2>
          <p>Retrieve normalized leave records from the {providerName} ERP.</p>
        </div>
      </div>
      </div>
      </>
  );
}

export default ErpActions;
