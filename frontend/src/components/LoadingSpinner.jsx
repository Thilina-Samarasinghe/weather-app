function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" />
      {message && <p className="spinner-msg">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;
