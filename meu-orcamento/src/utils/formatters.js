export const formatarMoeda = (valor) => {
  if (typeof valor !== 'number') return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};