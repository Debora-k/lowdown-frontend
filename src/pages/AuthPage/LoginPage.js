import React, { useEffect, useState } from 'react';
import './login.style.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { forgotPassword, loginWithGoogle } from '../../features/user/userSlice';
import { loginWithEmail } from '../../features/user/userSlice';
import GoogleButton from 'react-google-button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../composition/Modal';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((store) => store.user);
  const [modalOn, setModalOn] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  function submitHandle(e) {
    e.preventDefault();
    const [email, password] = e.target;
    const items = { email: email.value, password: password.value };

    dispatch(loginWithEmail(items));
  }

  function sendLink(e) {
    e.preventDefault();
    const [email] = e.target;

    dispatch(forgotPassword({ email: email.value }));
    setModalOn(false);
  }

  const handleGoogleLogin = async (googleData) => {
    dispatch(loginWithGoogle(googleData.access_token));
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: () => console.log('Login Failed'),
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <main className="login">
        <div className="login__content">
          <h1>Welcome back</h1>
          <p>Please enter your details</p>
          <form className="login__form" onSubmit={submitHandle}>
            <label>
              Email{' '}
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                autoComplete="off"
              />
            </label>
            <label>
              Password{' '}
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                autoComplete="off"
              />
            </label>
            <div className="login__btn-box">
              <button className="login__btn-submit" type="submit">
                Sign in
              </button>
            </div>
            <div className="login__btn-box">
              <button
                type="button"
                className="login__btn-forgotpassword"
                onClick={() => setModalOn(true)}
              >
                Forgot Your Password?
              </button>
            </div>
          </form>
          {error && (
            <div className="login__error">
              {error.message || error.toString()}
            </div>
          )}
          <div className="login__party">
            <div className="login__party-text">
              <div className="login__party-signup">or sign up with</div>
              <div className="login__party-line"></div>
            </div>

            <div className="google__btn">
              <GoogleButton onClick={login} label="Sign in with Google" />
            </div>
          </div>

          <div className="login__link">
            Don't have an account?{' '}
            <Link to={'/register'} title="go to register page">
              Sign up
            </Link>
          </div>
        </div>
      </main>
      {modalOn && (
        <Modal setModalOn={setModalOn}>
          <form className="forgotpassword__form" onSubmit={sendLink}>
            <div className="modal__content">
              {/* <div className="login__content"> */}
              <div className="modal__title">
                Enter your <span>email address</span> that you signed up with
              </div>
              <div>We will send a link to reset your password shortly</div>
              <div>If you are having any trouble, please contact us!</div>
              <div className="=login__form">
                <label className="reset-password__email">
                  <span>Your Email :</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    autoComplete="off"
                  />
                </label>
              </div>
              {/* </div> */}
              <div className="modal__btn-box">
                <button className="modal__btn modal__btn--warn">Send</button>
                <button
                  className="modal__btn"
                  onClick={() => setModalOn(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default LoginPage;
