import React from 'react';
import PropTypes from 'prop-types';
import { formatarMoeda } from '../../utils/formatters';
import styles from './ListaMateriais.module.css';

const ListaMateriais = ({ materiais }) => {
  if (!materiais || materiais.length === 0) {
    return <p>Nenhum material listado.</p>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.tabelaMateriais}>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Quantidade Estimada</th>
            <th>Custo Estimado</th>
          </tr>
        </thead>
        <tbody>
          {materiais.map((material, index) => (
            <tr key={index}>
              <td data-label="Descrição">{material.descricao}</td>
              <td data-label="Quantidade">{material.quantidade_estimada}</td>
              <td data-label="Custo">{formatarMoeda(material.custo_estimado)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ListaMateriais.propTypes = {
  materiais: PropTypes.arrayOf(
    PropTypes.shape({
      descricao: PropTypes.string.isRequired,
      quantidade_estimada: PropTypes.string.isRequired,
      custo_estimado: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ListaMateriais;