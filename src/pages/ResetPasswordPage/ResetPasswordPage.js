import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import './resetpassword.style.css';
import { resetPassword } from '../../features/user/userSlice';
import { useDispatch } from 'react-redux';

const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState({
    token: query.get('token') || '',
    id: query.get('id') || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [password, confirmPassword] = e.target;

    if (password.value === confirmPassword.value) {
      dispatch(resetPassword({ ...searchQuery, password: password.value }));
      navigate('/login');
    }
  };

  const handleReset = () => {
    navigate('/login');
  };

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
              name="confirmPassword"
              required
              autoComplete="off"
            />
          </label>
          <button className="reset-password__button" onClick={handleSubmit}>
            Save
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
