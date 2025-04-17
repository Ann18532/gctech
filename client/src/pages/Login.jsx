import './Login.css';

function Login() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/login';
  };

  return (
    <div className="login-fullscreen">
      <div className="login-box">
        <h1>Welcome to <span className="highlight">Unify</span></h1>
        <p className="subtitle">
          Connect and manage leaves across Oracle, SAP, and BambooHR.
        </p>
        <button onClick={handleGoogleLogin} className="google-btn">
          🔒 Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
