import React from 'react';
import { useSearchParams } from 'react-router-dom';

import './resetpassword.style.css';

const ResetPasswordPage = () => {
  const [query] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState({
    token: query.get('token') || '',
    id: query.get('id') || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [password, confirmPassword] = e.target;
    const obj = {
      password: password.value,
      confirm: confirmPassword.value,
    };

    const valid = checkFormValid(obj);
    if (!valid) return;
  };

  const handleReset = () => {};

  return (
    <div className="reset-password">
      <div className="reset-password__box">
        <h1 className="reset-password__title">Reset Your Password</h1>
        <form className="reset-password__form" onSubmit={handleSubmit}>
          <label>
            New Password
            <input
              type="password"
              placeholder="Enter your new password"
              name="password"
              required
              autoComplete="off"
            />
          </label>

          <label>
            Confirm New Password
            <input
              type="password"
              placeholder="Enter your confirm new password"
              name="password"
              required
              autoComplete="off"
            />
          </label>
          <button className="reset-password__button" onClick={handleSubmit}>
            {isSubmitting ? 'Signing up ...' : 'Register'}
          </button>
          <button type="cancel__button" onClick={handleReset}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
