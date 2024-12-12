import React, { useEffect, useState } from 'react';
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import './navbar.style.css';
import { useDispatch, useSelector } from 'react-redux';
import { loginWithToken, logout } from '../../features/user/userSlice';
import { getArticlesByTitle } from '../../features/article/articleSlice';
import HamburgerIcon from '../../assets/icons/HamburgerIcon';
import ExitIcon from '../../assets/icons/ExitIcon';
import SearchIcon from '../../assets/icons/SearchIcon';
import { categoryList } from '../../utils/categoryList';
import Modal from '../../composition/Modal';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [query] = useSearchParams();
  let category = query.get('category') || 'business';
  if (!categoryList.includes(category)) category = 'business';

  const [isMenuOn, setIsMenuOn] = useState(false);
  const [isLogoutModalOn, setIsLogoutModalOn] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { selectedArticle } = useSelector((store) => store.article);
  const [isSearchModalOn, setIsSearchModalOn] = useState(false);
  const onCheckEnter = (event) => {
    if (event.key === 'Enter') {
      if (event.target.value === '') {
        return navigate('/');
      }
      dispatch(getArticlesByTitle({ searchTitle: event.target.value }));
      setIsSearchModalOn(false);
      event.target.value = '';
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      dispatch(loginWithToken());
    }
  }, [dispatch]);

  useEffect(() => {
    function resizeHandler() {
      if (selectedArticle || (isMenuOn && window.innerWidth <= 1125)) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        setIsMenuOn(false);
      }
    }

    resizeHandler();
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [isMenuOn, selectedArticle]);

  function getMenuTrigger() {
    setIsMenuOn((prev) => !prev);
  }

  function handleLogout() {
    dispatch(logout({ navigate }));
    handleLogoutConfirm();
  }

  function handleLogoutConfirm() {
    setIsLogoutModalOn((prev) => !prev);
  }

  function handleLogin() {
    navigate('/login');
  }

  function handleSearch() {
    setIsSearchModalOn((prev) => !prev);
  }

  return (
    <header className="navbar">
      <div className="navbar__menu" onClick={getMenuTrigger}>
        <HamburgerIcon />
      </div>
      <NavLink
        to="/"
        className="navbar__logo"
        onClick={() => window.scrollTo(0, 0)}
      >
        <div className="image-container">
          <img src="/assets/images/lowdown-logo.png" alt="logo-image" />
        </div>
      </NavLink>

      <nav>
        <div className="navbar__content">
          <div className="navbar__search-btn">
            <button onClick={handleSearch}>
              <SearchIcon />
            </button>
          </div>
          {user ? (
            <>
              <button className="navbar__btn" onClick={handleLogoutConfirm}>
                Log Out
              </button>
              {location.pathname !== '/myfavorite' ? (
                <Link className="navbar__favorite" to="/myfavorite">
                  My Page
                </Link>
              ) : (
                <Link className="navbar__favorite" to="/">
                  Home
                </Link>
              )}
            </>
          ) : (
            <>
              <button className="navbar__btn" onClick={handleLogin}>
                Log In
              </button>
              <Link className="navbar__register" to="/register">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      <>
        <section
          className={`navbar__aside ${isMenuOn && 'navbar__aside--active'}`}
        >
          <div className="navbar__aside-content">
            <h3>Category</h3>
            <div className="line"></div>
            <ul>
              {categoryList.map((item) => (
                <li key={item} onClick={getMenuTrigger}>
                  <Link
                    className={`navbar__aside-link ${
                      category === item && 'navbar__aside-link--active'
                    }`}
                    to={`/?category=${item}`}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="navbar__aside-close" onClick={getMenuTrigger}>
              <ExitIcon />
            </div>
          </div>
        </section>
        {isMenuOn && (
          <div className="navbar__aside-bg" onClick={getMenuTrigger}></div>
        )}
        {isLogoutModalOn && (
          <Modal setModalOn={setIsLogoutModalOn}>
            <div className="modal__title">
              Are you sure you want to <span>log out</span>?
            </div>
            <div className="modal__btn-box">
              <button
                className="modal__btn modal__btn--warn"
                onClick={handleLogout}
              >
                Log out
              </button>
              <button className="modal__btn" onClick={handleLogoutConfirm}>
                Cancel
              </button>
            </div>
          </Modal>
        )}
        {isSearchModalOn && (
          <Modal setModalOn={setIsSearchModalOn}>
            <div className="modal__btn-box">
              <input
                type="text"
                placeholder={`Search in ${category} category`}
                onKeyDown={onCheckEnter}
              />
            </div>
          </Modal>
        )}
      </>
    </header>
  );
};

export default Navbar;
