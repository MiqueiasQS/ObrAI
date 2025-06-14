import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrcamentoData } from '../../hooks/useOrcamentoData';
import styles from './Orcamento.module.css';

// Componentes placeholder para fazer o código funcionar.
// Em um projeto real, cada um seria um arquivo .js separado.
const Card = ({ children, title, icon }) => (
  <div className={styles.card}>
    {title && <h2 className={styles.cardTitle}>{icon} {title}</h2>}
    {children}
  </div>
);
const InfoServico = ({ servico }) => (
  <div className={styles.infoGrid}>
    <p><strong>Nome:</strong> {servico?.nome}</p>
    <p><strong>Dimensão:</strong> {servico?.dimensao}</p>
  </div>
);
const ResumoCustos = ({ custos }) => (
  <div className={styles.infoGrid}>
    <p><strong>Mão de Obra:</strong> R$ {custos?.maodeobra?.toFixed(2)}</p>
    <p><strong>Materiais:</strong> R$ {custos?.materiais?.toFixed(2)}</p>
    <p className={styles.totalCost}><strong>Total:</strong> R$ {custos?.total?.toFixed(2)}</p>
  </div>
);
const DetalhesMaoDeObra = ({ maoDeObra }) => (
  <div className={styles.infoGrid}>
    <p><strong>Profissional:</strong> {maoDeObra?.profissional_sugerido}</p>
    <p><strong>Score:</strong> {maoDeObra?.score_de_produtividade}</p>
    <p><strong>Tempo Estimado:</strong> {maoDeObra?.tempo_estimado_pelo_ml}</p>
  </div>
);
const ListaMateriais = ({ materiais }) => (
  <ul className={styles.materialList}>
    {materiais?.length > 0 ? materiais.map((m, i) => (
      <li key={i}>{m.descricao} ({m.quantidade_estimada})</li>
    )) : <p>Nenhum material com rendimento especificado para este serviço.</p>}
  </ul>
);


const Orcamento = () => {
  // O hook que nos dá a função para chamar a API
  const { orcamento, loading, error, gerarOrcamento } = useOrcamentoData();
  // Hook do react-router-dom para pegar o ID da URL
  const { id } = useParams();

  // useEffect será executado quando o componente montar ou quando o 'id' mudar
  useEffect(() => {
    // Busca os orçamentos salvos no localStorage
    const savedBudgets = JSON.parse(localStorage.getItem('savedBudgets')) || [];
    // Encontra o orçamento específico que corresponde ao ID da URL
    const budgetParams = savedBudgets.find(b => b.id.toString() === id);

    if (budgetParams) {
      // Se encontrou, chama a API com os parâmetros daquele orçamento
      gerarOrcamento(budgetParams);
    } else {
      console.error(`Orçamento com ID ${id} não encontrado no localStorage.`);
      // Você poderia definir um estado de erro aqui para mostrar na tela
    }
    // A função é chamada apenas quando o componente monta ou o ID muda.
    // Adicionar 'gerarOrcamento' ao array de dependências é uma boa prática.
  }, [id, gerarOrcamento]);


  // Extrai os custos apenas se o orçamento existir
  const custos = orcamento ? {
    maodeobra: orcamento.custo_estimado_maodeobra,
    materiais: orcamento.custo_estimado_materiais,
    total: orcamento.custo_total_orcamento,
  } : null;

  return (
    <div className={styles.orcamentoPage}>
      <header className={styles.header}>
        <h1>Detalhes do Orçamento</h1>
        <Link to="/" className={styles.backButton}>Voltar à Lista</Link>
      </header>

      {/* Não precisamos mais do botão, a geração é automática */}
      
      {loading && <div className={styles.status}>Calculando orçamento com IA...</div>}
      
      {error && <div className={`${styles.status} ${styles.error}`}>{error}</div>}

      {/* Renderiza os resultados apenas se o 'orcamento' não for nulo */}
      {orcamento && !loading && (
        <main className={styles.resultsGrid}>
          <Card title="Serviço Solicitado" icon="📋">
            <InfoServico servico={orcamento.servico_solicitado} />
          </Card>

          <Card title="Resumo Financeiro" icon="💰">
            <ResumoCustos custos={custos} />
          </Card>

          <Card title="Análise da Mão de Obra" icon="👷‍♂️">
            <DetalhesMaoDeObra maoDeObra={orcamento.detalhe_maodeobra} />
          </Card>

          <Card title="Lista de Materiais" icon="🛠️">
            <ListaMateriais materiais={orcamento.detalhe_materiais} />
          </Card>
        </main>
      )}
    </div>
  );
};

export default Orcamento;
