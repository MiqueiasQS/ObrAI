import { useState, useCallback } from 'react'; // Importamos o useCallback
import axios from 'axios';

// A URL da sua API de orçamento detalhado.
const API_URL = 'http://127.0.0.1:5000/gerar-orcamento';

export const useOrcamentoData = () => {
  const [orcamento, setOrcamento] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // AQUI ESTÁ A CORREÇÃO:
  // Envolvemos a função com useCallback.
  // O array de dependências vazio `[]` garante que a função seja criada
  // apenas uma vez, quando o hook é montado, e não a cada renderização.
  const gerarOrcamento = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    setOrcamento(null);

    try {
      const response = await axios.post(API_URL, params);
      setOrcamento(response.data);
    } catch (err) {
      console.error("Falha ao buscar orçamento:", err);
      let errorMsg = 'Ocorreu um erro ao processar sua solicitação.';
      if (err.response) {
        errorMsg = `Erro do servidor: ${err.response.status} - ${err.response.data?.erro || 'Tente novamente.'}`;
      } else if (err.request) {
        errorMsg = 'Não foi possível conectar à API de orçamento. Verifique se ela está rodando.';
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []); // Array de dependências vazio

  // Retornamos o estado e a função estável
  return { orcamento, loading, error, gerarOrcamento };
};
