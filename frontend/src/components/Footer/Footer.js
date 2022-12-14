import React from 'react';
import './footer.scss';

const Footer = () => {
  const year = new Date().getFullYear();
  return <footer>{`Copyright © Paula Kuwalek ${year}`}</footer>;
};

export default Footer;
