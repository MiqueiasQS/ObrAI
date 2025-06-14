from flask import Flask, request, jsonify
from flask_cors import CORS # Importe a biblioteca
import json
import joblib
import pandas as pd
import pprint

def carregar_recursos():
    """Carrega o pipeline e os bancos de dados."""
    try:
        pipeline = joblib.load('modelo_preditivo_tempo.joblib')
        model_columns = joblib.load('colunas_do_modelo.joblib')
        with open('servicos_base.json', 'r', encoding='utf-8') as f:
            servicos_db = {s['id_servico']: s for s in json.load(f)}
        with open('insumos_catalogo.json', 'r', encoding='utf-8') as f:
            insumos_db = {i['id_insumo']: i for i in json.load(f)}
        with open('maodeobra_com_scores.json', 'r', encoding='utf-8') as f:
            maodeobra_db = json.load(f)
        return pipeline, model_columns, servicos_db, insumos_db, maodeobra_db
    except FileNotFoundError as e:
        print(f"ERRO: Arquivo de recurso não encontrado: {e.filename}")
        return None, None, None, None, None

def gerar_orcamento_inteligente(id_servico_desejado, dimensao, complexidade_tarefa, acesso_local_tarefa):
    """Gera o orçamento completo usando o pipeline de ML."""
    pipeline, model_columns, servicos_db, insumos_db, maodeobra_db = carregar_recursos()
    if not pipeline: return {"erro": "Sistema não inicializado."}

    servico = servicos_db.get(id_servico_desejado)
    
    # Inicializa o dicionário de orçamento que será populado
    orcamento = {
        "servico_solicitado": {"nome": servico["nome_servico"], "dimensao": f"{dimensao} {servico['unidade_medida']}"},
        "custo_estimado_materiais": 0.0,
        "detalhe_materiais": [],
        "custo_estimado_maodeobra": 0.0,
        "detalhe_maodeobra": {},
        "custo_total_orcamento": 0.0
    }
    
    # --- Cálculo de Custo dos Materiais ---
    for id_insumo in servico.get("insumos_necessarios", []):
        insumo = insumos_db.get(id_insumo)
        if insumo and "rendimento_por_unidade" in insumo:
            quantidade_necessaria = dimensao / insumo["rendimento_por_unidade"]
            custo_insumo = quantidade_necessaria * insumo["preco_unitario"]
            orcamento["detalhe_materiais"].append({
                "descricao": insumo["descricao"],
                "quantidade_estimada": f"{quantidade_necessaria:.2f} {insumo['unidade_compra']}(s)",
                "custo_estimado": round(custo_insumo, 2)
            })
            orcamento["custo_estimado_materiais"] += custo_insumo

    # --- Seleção de Mão de Obra ---
    profissionais_qualificados = [ {**p, "score": esp["score_produtividade"]} for p in maodeobra_db for esp in p.get("especialidades", []) if servico["nome_servico"] in esp["nome"] ]
    if not profissionais_qualificados: return {"erro": "Nenhum profissional qualificado."}
    melhor_profissional = max(profissionais_qualificados, key=lambda p: p["score"])
    
    # --- Previsão de Tempo com ML ---
    dados_para_previsao_dict = {
        'dimensao_executada': dimensao, 'complexidade': complexidade_tarefa, 'descricao_servico': servico["nome_servico"],
        'id_profissional': melhor_profissional["id_profissional"], 'acesso_local': acesso_local_tarefa, 'condicoes_climaticas': 'Boa'
    }
    df_para_prever = pd.DataFrame([dados_para_previsao_dict])
    df_para_prever_processed = pd.get_dummies(df_para_prever)
    df_para_prever_reindexed = df_para_prever_processed.reindex(columns=model_columns, fill_value=0)
    
    tempo_estimado_ml = pipeline.predict(df_para_prever_reindexed)[0]
    tempo_estimado_ml = max(tempo_estimado_ml, 0)

    # --- Montagem do Orçamento Final (VERSÃO CORRIGIDA) ---
    custo_por_hora = melhor_profissional["custo_diaria"] / 8
    custo_maodeobra = tempo_estimado_ml * custo_por_hora
    
    # Atualiza o dicionário 'orcamento' que já contém os materiais
    orcamento["detalhe_maodeobra"] = {
        "profissional_sugerido": melhor_profissional["nome"],
        "funcao": melhor_profissional["funcao"],
        "score_de_produtividade": melhor_profissional["score"],
        "tempo_estimado_pelo_ml": f"{tempo_estimado_ml:.2f} horas"
    }
    orcamento["custo_estimado_maodeobra"] = round(custo_maodeobra, 2)
    orcamento["custo_estimado_materiais"] = round(orcamento["custo_estimado_materiais"], 2)
    
    # O custo total agora soma corretamente os dois valores
    orcamento["custo_total_orcamento"] = round(orcamento["custo_estimado_materiais"] + orcamento["custo_estimado_maodeobra"], 2)

    return orcamento

# 1. Inicializa a aplicação Flask
app = Flask(__name__)
CORS(app)

# 2. Define o endpoint (a URL) e o método (POST)
@app.route('/gerar-orcamento', methods=['POST'])
def handle_orcamento():
    # 3. Pega os dados JSON enviados na requisição
    data = request.get_json()

    # 4. Validação simples dos dados de entrada
    if not data:
        return jsonify({"erro": "Nenhum dado enviado no corpo da requisição"}), 400
    
    required_keys = ["id_servico", "dimensao", "complexidade", "acesso"]
    if not all(key in data for key in required_keys):
        return jsonify({"erro": "Dados faltando. Chaves necessárias: " + str(required_keys)}), 400

    # 5. Chama a sua função principal com os dados recebidos
    orcamento = gerar_orcamento_inteligente(
        id_servico_desejado=data['id_servico'],
        dimensao=data['dimensao'],
        complexidade_tarefa=data['complexidade'],
        acesso_local_tarefa=data['acesso']
    )

    # 6. Retorna o resultado como um JSON
    if "erro" in orcamento:
        return jsonify(orcamento), 500 # Erro interno do servidor se algo falhar
        
    return jsonify(orcamento)

# 7. Roda o servidor da API
if __name__ == '__main__':
    # O 'debug=True' é ótimo para desenvolvimento
    app.run(host='0.0.0.0', port=5000, debug=True)