// /src/components/ResumoCustos/ResumoCustos.js
import React from 'react';
import PropTypes from 'prop-types';
import { formatarMoeda } from '../../utils/formatters';
import styles from './ResumoCustos.module.css';

const ResumoCustos = ({ custos }) => (
  <div className={styles.resumo}>
    <p>
      <span>Custo Estimado Mão de Obra:</span>
      <span>{formatarMoeda(custos.maodeobra)}</span>
    </p>
    <p>
      <span>Custo Estimado Materiais:</span>
      <span>{formatarMoeda(custos.materiais)}</span>
    </p>
    <div className={styles.total}>
      <strong>Custo Total do Orçamento:</strong>
      <strong>{formatarMoeda(custos.total)}</strong>
    </div>
  </div>
);

ResumoCustos.propTypes = {
  custos: PropTypes.shape({
    maodeobra: PropTypes.number.isRequired,
    materiais: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
};

export default ResumoCustos;