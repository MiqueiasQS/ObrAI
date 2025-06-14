import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ListaOrcamentos.module.css'; // Estilos para esta página


function ListaOrcamentos() {
    const [savedBudgets, setSavedBudgets] = useState([]);
      const [messages, setMessages] = useState([]);
      const [input, setInput] = useState('');
      const [currentState, setCurrentState] = useState({
        id_servico: null,
        dimensao: null,
        complexidade: null,
        acesso: null,
      });
      const [isLoading, setIsLoading] = useState(false);
      const [isChatOpen, setIsChatOpen] = useState(false); // Novo estado para controlar o chat
    
      const chatEndRef = useRef(null);
    
      // --- EFEITOS (EFFECTS) ---
    
      // Carrega orçamentos do localStorage na primeira vez
      useEffect(() => {
        try {
          const budgetsFromStorage = JSON.parse(localStorage.getItem('savedBudgets'));
          if (budgetsFromStorage) {
            setSavedBudgets(budgetsFromStorage);
          }
        } catch (error) {
          console.error("Erro ao carregar orçamentos do localStorage:", error);
        }
      }, []);
    
      // Salva orçamentos no localStorage sempre que a lista mudar
      useEffect(() => {
        try {
          localStorage.setItem('savedBudgets', JSON.stringify(savedBudgets));
        } catch (error) {
          console.error("Erro ao salvar orçamentos no localStorage:", error);
        }
      }, [savedBudgets]);
    
      // Rola o chat para a última mensagem
      useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [messages]);
    
    
      // --- FUNÇÕES ---
    
      // Inicia uma nova conversa e abre o chat
      const handleNewBudget = () => {
        setMessages([{ author: 'bot', text: 'Olá! Descreva o serviço que você precisa orçar.' }]);
        setCurrentState({
          id_servico: null,
          dimensao: null,
          complexidade: null,
          acesso: null,
        });
        setIsLoading(false);
        setInput('');
        setIsChatOpen(true); // Abre o painel do chat
      };
    
      // Lida com o envio de mensagens do chat
      const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
    
        const userMessage = { author: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
    
        try {
          const chatResponse = await fetch('http://127.0.0.1:5001/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              estado_atual: currentState,
              nova_mensagem: input,
            }),
          });
          const chatData = await chatResponse.json();
    
          const botMessage = { author: 'bot', text: chatData.resposta_bot };
          setMessages(prev => [...prev, botMessage]);
          setCurrentState(chatData.estado_atualizado);
    
          if (chatData.status === 'completo') {
            const finalParams = chatData.parametros_finais;
            const newBudget = {
              id: new Date().getTime(),
              ...finalParams,
              data: new Date().toLocaleDateString('pt-BR')
            };
            setSavedBudgets(prev => [newBudget, ...prev]);
    
            const successMessage = { author: 'bot', text: 'Orçamento salvo com sucesso! Você pode fechar esta janela.' };
            setMessages(prev => [...prev, successMessage]);
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Erro ao chamar a API:", error);
          const errorMessage = { author: 'bot', text: 'Desculpe, estou com problemas de conexão.' };
          setMessages(prev => [...prev, errorMessage]);
          setIsLoading(false);
        }
      };
      
      return (
        <div className="App">
          <header className="App-header">
            <h1>Meus Orçamentos</h1>
          </header>
    
          <main className="main-content">
            <div className="saved-budgets-container">
              {savedBudgets.length === 0 ? (
                <div className="empty-state">
                  <h2>Nenhum orçamento salvo ainda.</h2>
                  <p>Clique no botão '+' para criar seu primeiro orçamento com IA.</p>
                </div>
              ) : (
                <div className="budgets-list">
                  {savedBudgets.map(budget => (
                  // CADA CARD É UM LINK PARA A PÁGINA DE DETALHES
                  <Link to={`/orcamento/${budget.id}`} key={budget.id} className="budget-card-link">
                    <div className="budget-card">
                      <h3>Serviço: <span>{budget.id_servico}</span></h3>
                      <p><strong>Dimensão:</strong> {budget.dimensao}</p>
                      <p><strong>Complexidade:</strong> {budget.complexidade}</p>
                      <p className="budget-date"><em>Salvo em: {budget.data}</em></p>
                    </div>
                  </Link>
                  ))}
                </div>
              )}
            </div>
          </main>
    
          {/* Chat Flutuante */}
          {isChatOpen && (
            <div className="chat-modal-overlay">
              <div className="chat-container">
                <div className="chat-header">
                  <h2>Orçamento Rápido</h2>
                  <button onClick={() => setIsChatOpen(false)} className="close-btn">&times;</button>
                </div>
                <div className="chat-window">
                  {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.author}`}>
                      <p>{msg.text}</p>
                    </div>
                  ))}
                  {isLoading && <div className="message bot"><p>Digitando...</p></div>}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSend} className="chat-form">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isLoading ? "Aguarde..." : "Descreva o serviço..."}
                    disabled={isLoading}
                  />
                  <button type="submit" disabled={isLoading} title="Enviar">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="2 0 22 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z"/>
        <path d="M22 2 11 13"/>
      </svg>
    </button>
                </form>
              </div>
            </div>
          )}
    
          {/* Botão Flutuante para Abrir o Chat */}
          {!isChatOpen && (
            <button onClick={handleNewBudget} className="floating-chat-btn">
              +
            </button>
          )}
        </div>
      );
}

export default ListaOrcamentos;