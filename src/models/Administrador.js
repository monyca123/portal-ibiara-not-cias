import Usuario from './Usuario.js';

export default class Administrador extends Usuario {
  papel() {
    return 'administrador';
  }

  permissoes() {
    return [
      'criar_noticia',
      'editar_qualquer_noticia',
      'excluir_qualquer_noticia',
      'gerenciar_categorias',
      'gerenciar_usuarios',
    ];
  }

  podeEditar() {
    return true;
  }
}
