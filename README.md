Orçamento Inteligente com IA para Construção Civil
Este projeto é uma aplicação completa que utiliza Inteligência Artificial para gerar orçamentos detalhados para obras de construção civil. A interação principal acontece através de uma interface de chat conversacional, onde o usuário descreve suas necessidades em linguagem natural, e a aplicação utiliza múltiplos modelos de IA para fornecer estimativas precisas.

Principais Funcionalidades
Chatbot Inteligente: Uma interface de chat em React, potencializada pelo modelo Gemini do Google, que interpreta os pedidos do usuário para coletar os parâmetros do orçamento.

Modelo Preditivo de Tempo: Um modelo de Machine Learning (Random Forest) treinado com scikit-learn que prevê o tempo de conclusão de um serviço com base em características como dimensão, complexidade e o profissional alocado.

Scoring de Produtividade: Um sistema de análise de dados com pandas que lê o histórico de obras para calcular um score de produtividade para cada profissional, ajudando a selecionar a mão de obra mais adequada.

Orçamento Detalhado: Geração de um orçamento completo, incluindo custos de materiais (baseado em rendimento), custos de mão de obra (baseado no tempo previsto pela IA) e o custo total.

Persistência de Dados: Os parâmetros dos orçamentos gerados são salvos no localStorage do navegador, permitindo a listagem e a consulta futura.

Tecnologias Utilizadas
Backend:

Python 3

Flask: Para criar a API REST que serve a lógica de negócio.

Pandas: Para manipulação e análise de dados no cálculo de scores.

Scikit-learn: Para treinar e executar o modelo de Machine Learning preditivo.

Google Generative AI: Para o modelo de linguagem gemini-1.5-flash que alimenta o chat.

Joblib: Para salvar e carregar o modelo de ML treinado.

Frontend:

React.js

Axios: Para fazer as requisições HTTP para a API Python.

CSS Modules: Para estilização dos componentes de forma encapsulada.

Como Configurar e Rodar o Projeto
O projeto é dividido em duas partes principais: o Backend (API em Flask) e o Frontend (Aplicação em React). Ambas precisam estar rodando simultaneamente.

Backend
Navegue até a pasta do backend no seu terminal.

Crie e ative um ambiente virtual (recomendado):

python -m venv venv
source venv/bin/activate  # No macOS/Linux
.\venv\Scripts\activate   # No Windows

Instale as dependências Python:

pip install Flask Flask-Cors pandas scikit-learn google-generativeai joblib

(Passo Único) Treine os Modelos: Antes de rodar a API pela primeira vez, você precisa gerar os "artefatos" de IA. Execute os scripts na ordem:

python passo1_calcular_scores.py
python treinar_modelo.py

Inicie a API de Chat: (Assumindo que sua API principal está no arquivo api_chat.py ou similar)

python api_chat.py

O servidor do backend deve iniciar na porta 5001.

Frontend
Abra um novo terminal e navegue até a pasta do seu projeto React.

Instale as dependências Node.js:

npm install

Inicie a aplicação React:

npm start

Uma nova aba abrirá no seu navegador no endereço http://localhost:3000.

Como Usar
Com o backend e o frontend rodando, acesse http://localhost:3000.

Clique no botão flutuante + para iniciar uma nova conversa de orçamento.

Descreva o serviço que você precisa no chat (ex: "quero pintar 100 metros de parede").

Responda às perguntas do assistente de IA até que todos os parâmetros sejam coletados.

O novo orçamento será salvo e aparecerá na lista da tela principal.

Clique em qualquer card de orçamento salvo na lista para ver os detalhes, que são calculados pela sua outra API de orçamento.
