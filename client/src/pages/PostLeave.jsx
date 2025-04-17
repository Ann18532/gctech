import { useParams, useNavigate } from 'react-router-dom';
import './PostLeave.css';

function PostLeave() {
  const { provider } = useParams();
  const navigate = useNavigate();

  return (
    <div className="postleave-wrapper">
      <div className="postleave-card-centered">
        <h1 className="postleave-title">Submit Leave via Unify</h1>

        <div className="api-section">
          <h2>📡 API Endpoint</h2>
          <code className="api-code">POST /api/leaves</code>
        </div>

        <div className="fields-section">
          <h2>📝 Fields</h2>
          <div className="field-table">
            <div className="field-row">
              {/* <span className="field-dot" title="Required">•</span> */}
              <span className="field-name">name</span>
              <span className="field-desc">Employee full name</span>
            </div>
            <div className="field-row">
              {/* <span className="field-dot" title="Required">•</span> */}
              <span className="field-name">email</span>
              <span className="field-desc">Employee email address</span>
            </div>
            <div className="field-row">
              {/* <span className="field-dot" title="Required">•</span> */}
              <span className="field-name">leave_start</span>
              <span className="field-desc">Start date of leave</span>
            </div>
            <div className="field-row">
              {/* <span className="field-dot" title="Required">•</span> */}
              <span className="field-name">leave_end</span>
              <span className="field-desc">End date of leave</span>
            </div>
            <div className="field-row">
              {/* <span className="field-dot placeholder"></span> */}
              <span className="field-name">leave_reason</span>
              <span className="field-desc">Reason for leave</span>
            </div>
          </div>
        </div>

        <button className="proceed-btn" onClick={() => navigate(`/erp/${provider}/post/form`)}>
          ➕ Fill Leave Form
        </button>
      </div>
    </div>
  );
}

export default PostLeave;
