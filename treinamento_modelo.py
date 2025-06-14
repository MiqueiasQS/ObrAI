import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

def treinar_modelo_completo_e_final():
    print("\n--- TREINAMENTO DEFINITIVO (com salvamento de colunas) ---")
    df = pd.read_json('historico_completo_obras.json', encoding='utf-8')
    df_processed = pd.get_dummies(df, columns=['descricao_servico', 'id_profissional', 'acesso_local', 'condicoes_climaticas'], drop_first=True)
    
    colunas_para_remover = ['id_tarefa_executada', 'id_servico', 'unidade_medida', 'tempo_gasto_horas', 'materiais_consumidos']
    X = df_processed.drop(columns=colunas_para_remover, errors='ignore')
    y = df_processed['tempo_gasto_horas']
    
    # ... (o resto do código de criação do pipeline é o mesmo) ...
    numeric_features = ['dimensao_executada', 'complexidade']
    categorical_features = [col for col in X.columns if col not in numeric_features]
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', 'passthrough', categorical_features)
        ])
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
    ])
    
    pipeline.fit(X, y) # Treinamos com todos os dados para um modelo final mais robusto
    print("Modelo treinado com sucesso!")

    # --- SALVANDO O MODELO E AS COLUNAS ---
    joblib.dump(pipeline, 'modelo_preditivo_tempo.joblib')
    joblib.dump(list(X.columns), 'colunas_do_modelo.joblib') # AQUI ESTÁ O AJUSTE IMPORTANTE
    
    print("Pipeline e LISTA DE COLUNAS salvos com sucesso!")

if __name__ == "__main__":
    treinar_modelo_completo_e_final()