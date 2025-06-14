// /src/components/InfoServico/InfoServico.js
import React from 'react';
import PropTypes from 'prop-types';
import styles from './InfoServico.module.css';

const InfoServico = ({ servico }) => (
  <div className={styles.infoServico}>
    <p><strong>Serviço:</strong> {servico.nome}</p>
    <p><strong>Dimensão:</strong> {servico.dimensao}</p>
  </div>
);

InfoServico.propTypes = {
  servico: PropTypes.shape({
    nome: PropTypes.string.isRequired,
    dimensao: PropTypes.string.isRequired,
  }).isRequired,
};

export default InfoServico;