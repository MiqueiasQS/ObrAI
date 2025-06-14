🚀 Orçamento Inteligente com IA para Construção Civil
Bem-vindo ao projeto de Orçamento Inteligente! Esta é uma aplicação completa que utiliza múltiplos modelos de Inteligência Artificial para gerar orçamentos detalhados para obras, tudo a partir de uma conversa em linguagem natural.

✨ Principais Funcionalidades
💬 Chatbot Conversacional: Uma interface de chat em React, potencializada pelo Gemini 1.5 Flash, que interpreta os pedidos do usuário para coletar os parâmetros do orçamento.

🧠 Modelo Preditivo de Tempo: Um modelo de Machine Learning (Random Forest) treinado com Scikit-learn que prevê com precisão o tempo de conclusão de um serviço.

📊 Scoring de Produtividade: Um sistema de análise de dados com Pandas que lê o histórico de obras para calcular um score de produtividade para cada profissional, ajudando a selecionar a mão de obra mais adequada.

📄 Orçamento Detalhado: Geração de um orçamento completo, incluindo custos de materiais (baseado em rendimento), custos de mão de obra (baseado no tempo previsto pela IA) e o custo total.

💾 Persistência de Dados: Os parâmetros dos orçamentos gerados são salvos no localStorage do navegador, permitindo a listagem e a consulta futura.

🛠️ Tecnologias Utilizadas
Categoria

Tecnologia

Descrição

Backend

🐍 Python 3

Linguagem principal da API.



🌐 Flask

Para criar as APIs REST que servem a lógica de negócio.



🐼 Pandas

Para manipulação e análise de dados no cálculo de scores.



🤖 Scikit-learn

Para treinar e executar o modelo de Machine Learning preditivo.



✨ Google Generative AI

Para o modelo de linguagem gemini-1.5-flash que alimenta o chat.



🗄️ Joblib

Para salvar e carregar o modelo de ML treinado.

Frontend

⚛️ React.js

Para construir a interface de usuário dinâmica e reativa.



axios

Para fazer as requisições HTTP para a API Python.



🎨 CSS Modules

Para estilização dos componentes de forma encapsulada.

⚙️ Como Configurar e Rodar o Projeto
O projeto possui dois servidores de backend que precisam rodar simultaneamente com o frontend.

Backend
Navegue até a pasta do backend no seu terminal.

Crie e ative um ambiente virtual (altamente recomendado):

python -m venv venv
source venv/bin/activate  # No macOS/Linux
.\venv\Scripts\activate   # No Windows

Instale as dependências Python:

pip install Flask Flask-Cors pandas scikit-learn google-generativeai joblib

(Passo Único) Treine os Modelos de IA: Antes de rodar as APIs, você precisa gerar os "artefatos" de IA. Execute os scripts na ordem:

python passo1_calcular_scores.py
python treinar_modelo.py

Inicie as APIs em terminais separados:

API de Orçamento (ML):

# Rode o servidor que calcula os orçamentos detalhados (porta 5000)
python sua_api_de_orcamento.py 

API de Chat (LLM):

# Rode o servidor que gerencia a conversa (porta 5001)
python api_chat.py

Nota: É crucial que as duas APIs estejam rodando para que a aplicação funcione completamente.

Frontend
Abra um novo terminal e navegue até a pasta do seu projeto React.

Instale as dependências:

npm install

Inicie a aplicação React:

npm start

Uma nova aba abrirá no seu navegador no endereço http://localhost:3000.

🚀 Como Usar
Com os três servidores (Frontend, API de Chat e API de Orçamento) rodando, acesse http://localhost:3000.

Clique no botão flutuante + para iniciar uma nova conversa.

Descreva o serviço que você precisa (ex: "quero pintar 100 metros de parede com acesso difícil").

Responda às perguntas do assistente até que todos os parâmetros sejam coletados.

O novo orçamento será salvo e aparecerá na lista da tela principal.

Clique em qualquer card da lista para navegar até a página de detalhes e ver o orçamento completo calculado pela IA.
