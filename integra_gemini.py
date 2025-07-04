import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import json

genai.configure(api_key="api_key")

model = genai.GenerativeModel('gemini-1.5-flash')

app = Flask(__name__)
CORS(app)

def chamar_api_orcamento(parametros):
    return parametros

def criar_prompt_atualizador(estado_atual, mensagem_usuario):
    """Cria o prompt para o Gemini atualizar o estado da conversa."""
    contexto_servicos = """
    - "Alvenaria Estrutural" (id_servico: "SERV_01"), - "Pintura Látex em Parede" (id_servico: "SERV_02"), - "Instalação de Porcelanato" (id_servico: "SERV_03"), - "Contrapiso de Concreto" (id_servico: "SERV_04"), - "Estrutura de Telhado" (id_servico: "SERV_05"), - "Instalação de Telha Cerâmica" (id_servico: "SERV_06"), - "Fundação com Sapata Simples" (id_servico: "SERV_07"), - "Parede Drywall" (id_servico: "SERV_08")
    """
    prompt = f"""
    Sua tarefa é ser um assistente de orçamentos. Seu objetivo é preencher os campos com valor `null` no JSON de `ESTADO_ATUAL` usando a informação contida na `NOVA_MENSAGEM_DO_USUARIO`.
    **ESTADO ATUAL DO ORÇAMENTO (JSON):**
    {json.dumps(estado_atual, indent=2)}
    **SERVIÇOS DISPONÍVEIS E SEUS IDs:**
    {contexto_servicos}
    **NOVA MENSAGEM DO USUÁRIO:**
    "{mensagem_usuario}"
    **REGRAS DE PROCESSAMENTO:**
    1.  Se a `NOVA_MENSAGEM_DO_USUARIO` não contiver pista sobre `complexidade` ou `acesso`, VOCÊ DEVE OBRIGATORIAMENTE manter seus valores como `null`. Sem complexidade deve ser considerado 1. NÃO preencha com um valor padrão. É CRÍTICO que o sistema depois pergunte ao usuário.
    2.  **dimensao**: Converta qualquer texto para um número de ponto flutuante (float). Ex: "vinte e cinco metros" -> 25.0.
    3.  **id_servico**: Use a lista de serviços para encontrar o ID correto.
    4.  **SAÍDA**: Sua única e exclusiva resposta DEVE ser o objeto JSON COMPLETO E ATUALIZADO, sem nenhum texto adicional.
    **SUA SAÍDA JSON ATUALIZADA:**
    """
    return prompt

def get_proxima_pergunta(parametros):
    """Gera a pergunta para o próximo parâmetro faltando."""
    if parametros.get("id_servico") is None: return "Para qual serviço você gostaria de um orçamento?"
    if parametros.get("dimensao") is None: return "Qual a dimensão (em m², m³, etc.) do serviço?"
    if parametros.get("complexidade") is None: return "Numa escala de 1 a 5, qual a complexidade do serviço?"
    if parametros.get("acesso") is None: return "O acesso ao local é Fácil ou Difícil?"
    return None

def criar_prompt_resumo_final(resultado_orcamento):
    """Cria o prompt para o Gemini gerar uma resposta amigável para o usuário."""
    prompt = f"""
    Apresente o seguinte orçamento (em formato JSON) para o usuário de forma clara, amigável e resumida.
    Destaque os principais pontos: o profissional sugerido, o tempo estimado, o custo dos materiais, o custo da mão de obra e o total.
    Não mostre o JSON cru. Comece com uma frase amigável como "Claro, preparei a estimativa para você!".

    DADOS DO ORÇAMENTO:
    {json.dumps(resultado_orcamento, indent=2)}
    """
    return prompt

@app.route('/chat', methods=['POST'])
def handle_chat():
    # Pega os dados enviados pelo frontend (React)
    data = request.get_json()
    if not data or "estado_atual" not in data or "nova_mensagem" not in data:
        return jsonify({"erro": "Requisição inválida. Faltam 'estado_atual' ou 'nova_mensagem'."}), 400
    
    estado_atual = data["estado_atual"]
    pergunta_seguinte = get_proxima_pergunta(estado_atual)
    nova_mensagem = pergunta_seguinte + data["nova_mensagem"]

    # Chama o Gemini para interpretar a mensagem do usuário e atualizar o estado
    prompt = criar_prompt_atualizador(estado_atual, nova_mensagem)
    response_ia = model.generate_content(prompt)

    try:
        json_text = response_ia.text.strip().replace('`', '').replace('json', '')
        estado_atualizado = json.loads(json_text)
    except (json.JSONDecodeError, KeyError):
        return jsonify({
            "status": "erro_ia",
            "resposta_bot": "Desculpe, não consegui processar essa informação. Pode tentar de outra forma?",
            "estado_atualizado": estado_atual  # Retorna o estado antigo sem alterações
        })

    # Verifica se todos os dados foram coletados
    pergunta_seguinte = get_proxima_pergunta(estado_atualizado)

    if pergunta_seguinte:
        # Se ainda faltam dados, retorna a próxima pergunta
        return jsonify({
            "status": "incompleto",
            "resposta_bot": pergunta_seguinte,
            "estado_atualizado": estado_atualizado
        })
    else:
        # Se todos os dados foram coletados, gera o orçamento
        print("Todos os dados coletados. Gerando o orçamento...")
        resultado_orcamento = chamar_api_orcamento(estado_atualizado)

        # Chama o Gemini uma última vez para criar uma resposta amigável
        # prompt_resumo = criar_prompt_resumo_final(resultado_orcamento)
        # resposta_final_ia = model.generate_content(prompt_resumo)

        # Retorna o resultado final e reseta o estado para uma nova conversa
        return jsonify({
            "status": "completo",
            "resposta_bot": "Dados coletados com sucesso.",
            "parametros_finais": resultado_orcamento,
            "estado_atualizado": {"id_servico": None, "dimensao": None, "complexidade": None, "acesso": None}
        })

if __name__ == '__main__':
    # Roda o servidor da API na porta 5001
    app.run(host='0.0.0.0', port=5001, debug=True)
