import React,  { Component, PropTypes } from "react";
import BaseHeader from '../../../components/Header';
import {Link} from 'react-router-dom';
import TopBar from '../../../components/TopBar';

class Header extends BaseHeader {

  render() {
    return <div className="lottery-header">{super.render()}</div>;
  }
  
};

Header.propTypes = {
  userModule: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired
};

export default Header;