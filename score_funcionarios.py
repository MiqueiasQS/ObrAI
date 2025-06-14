import pandas as pd
import json

def reconstruir_perfis_do_historico():
    print("--- PASSO 1: Iniciando Cálculo de Scores de Produtividade ---")
    try:
        with open('historico_completo_obras.json', 'r', encoding='utf-8') as f:
            historico_df = pd.DataFrame(json.load(f))
        with open('maodeobra.json', 'r', encoding='utf-8') as f:
            maodeobra_data = json.load(f)
        with open('servicos_base.json', 'r', encoding='utf-8') as f:
            servicos_data = {s['id_servico']: s for s in json.load(f)}
    except FileNotFoundError as e:
        print(f"Erro: Arquivo não encontrado. Verifique se '{e.filename}' existe.")
        return

    historico_df['horas_por_unidade'] = historico_df['tempo_gasto_horas'] / (historico_df['dimensao_executada'] + 0.001)
    historico_df['media_geral_servico'] = historico_df.groupby('id_servico')['horas_por_unidade'].transform('mean')
    historico_df['media_profissional_servico'] = historico_df.groupby(['id_profissional', 'id_servico'])['horas_por_unidade'].transform('mean')
    historico_df['score_bruto'] = historico_df['media_geral_servico'] / historico_df['media_profissional_servico']
    historico_df['score_final'] = (historico_df['score_bruto'] * 3).clip(1, 5).round(2)

    scores_finais = historico_df[['id_profissional', 'id_servico', 'score_final']].drop_duplicates().reset_index(drop=True)
    
    profissionais_dict = {p['id_profissional']: p for p in maodeobra_data}
    for prof_id in profissionais_dict:
        profissionais_dict[prof_id]['especialidades'] = []

    for index, row in scores_finais.iterrows():
        prof_id, servico_id, score = row['id_profissional'], row['id_servico'], row['score_final']
        if prof_id in profissionais_dict and servico_id in servicos_data:
            profissionais_dict[prof_id]['especialidades'].append({
                "nome": servicos_data[servico_id]['nome_servico'],
                "score_produtividade": score
            })

    maodeobra_atualizado = list(profissionais_dict.values())

    with open('maodeobra_com_scores.json', 'w', encoding='utf-8') as f:
        json.dump(maodeobra_atualizado, f, indent=2, ensure_ascii=False)

    print("Arquivo 'maodeobra_com_scores.json' criado/atualizado com sucesso!")

if __name__ == "__main__":
    reconstruir_perfis_do_historico()