import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareArrowUp } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import './ScrollButton.scss';

const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  window.addEventListener('scroll', toggleVisible);

  return (
    <Button>
      <FontAwesomeIcon icon="fa-sharp fa-solid fa-square-arrow-up" onClick={scrollToTop} />
      {/* <FaArrowCircleUp onClick={scrollToTop} style={{ display: visible ? 'inline' : 'none' }} /> */}
    </Button>
  );
};

export default ScrollButton;
