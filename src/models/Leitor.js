import Usuario from './Usuario.js';

export default class Leitor extends Usuario {
  papel() {
    return 'leitor';
  }

  permissoes() {
    return ['comentar'];
  }
}
