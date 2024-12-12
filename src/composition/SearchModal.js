import React from 'react';
import './styles/searchModal.style.css';

function SearchModal({ children, setModalOn }) {
  return (
    <div className="searchModal">
      <div className="searchModal__container">{children}</div>
      <div
        className="searchModal__back"
        onClick={() => setModalOn(false)}
      ></div>
    </div>
  );
}

export default SearchModal;
