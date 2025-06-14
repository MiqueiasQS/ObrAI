import React from 'react';
import PropTypes from 'prop-types';
import styles from './DetalhesMaoDeObra.module.css';

const DetalhesMaoDeObra = ({ maoDeObra }) => {
  return (
    <div className={styles.container}>
      <div className={styles.detalheItem}>
        <span className={styles.label}>Função</span>
        <span className={styles.valor}>{maoDeObra.funcao}</span>
      </div>
      <div className={styles.detalheItem}>
        <span className={styles.label}>Profissional Sugerido</span>
        <span className={styles.valor}>{maoDeObra.profissional_sugerido}</span>
      </div>
      <div className={styles.detalheItem}>
        <span className={styles.label}>Score de Produtividade</span>
        <span className={`${styles.valor} ${styles.score}`}>{maoDeObra.score_de_produtividade}</span>
      </div>
      <div className={styles.detalheItem}>
        <span className={styles.label}>Tempo Estimado (via ML)</span>
        <span className={styles.valor}>{maoDeObra.tempo_estimado_pelo_ml}</span>
      </div>
    </div>
  );
};

DetalhesMaoDeObra.propTypes = {
  maoDeObra: PropTypes.shape({
    funcao: PropTypes.string.isRequired,
    profissional_sugerido: PropTypes.string.isRequired,
    score_de_produtividade: PropTypes.number.isRequired,
    tempo_estimado_pelo_ml: PropTypes.string.isRequired,
  }).isRequired,
};

export default DetalhesMaoDeObra;