// /src/components/Card/Card.js
import React from 'react';
import PropTypes from 'prop-types';
import styles from './Card.module.css';

const Card = ({ title, icon, children }) => {
  return (
    <div className={styles.card}>
      {title && (
        <h2 className={styles.cardTitle}>
          {icon} {title}
        </h2>
      )}
      <div className={styles.cardContent}>
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.node,
  children: PropTypes.node.isRequired,
};

export default Card;