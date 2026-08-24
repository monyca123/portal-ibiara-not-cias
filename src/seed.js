import categoriaRepo from './repositories/CategoriaRepository.js';
import usuarioRepo from './repositories/UsuarioRepository.js';
import noticiaRepo from './repositories/NoticiaRepository.js';
import Categoria from './models/Categoria.js';
import Autor from './models/Autor.js';
import Administrador from './models/Administrador.js';
import Noticia from './models/Noticia.js';
import { gerarHash } from './utils/senha.js';

if (categoriaRepo.listar().length === 0) {
  const categorias = [
    new Categoria('Ibiara em Foco', 'local'),
    new Categoria('Regiao do Vale do Pianco', 'local'),
    new Categoria('Politica Nacional', 'geral'),
    new Categoria('Economia', 'geral'),
    new Categoria('Esportes', 'geral'),
  ];
  categorias.forEach((c) => categoriaRepo.adicionar(c));
  console.log(`Categorias criadas: ${categorias.length}`);
}

if (usuarioRepo.listar().length === 0) {
  const admin = new Administrador('Redacao Ibiara Noticias', 'admin@ibiaranoticias.com.br', gerarHash('admin123'));
  const autora = new Autor(
    'Maria Souza',
    'maria@ibiaranoticias.com.br',
    gerarHash('autora123'),
    'Jornalista cobrindo o municipio de Ibiara e regiao ha 5 anos.'
  );
  usuarioRepo.adicionar(admin);
  usuarioRepo.adicionar(autora);
  console.log('Usuarios criados: 2 (admin@ibiaranoticias.com.br / senha admin123, maria@ibiaranoticias.com.br / senha autora123)');
}

if (noticiaRepo.listar().length === 0) {
  const categorias = categoriaRepo.listar();
  const [autor] = usuarioRepo.listar().filter((u) => u.papel() === 'autor');
  const noticias = [
    new Noticia({
      titulo: 'Prefeitura de Ibiara anuncia reforma da praca central',
      resumo: 'Obras devem comecar no proximo mes e incluem nova iluminacao e paisagismo.',
      conteudo:
        'A Prefeitura Municipal de Ibiara anunciou nesta semana o inicio das obras de reforma da praca central da cidade. O projeto inclui nova iluminacao em LED, bancos, paisagismo e uma area para eventos culturais. A previsao e que os trabalhos comecem no proximo mes e durem cerca de 90 dias.',
      categoriaId: categorias.find((c) => c.nome === 'Ibiara em Foco').id,
      autorId: autor.id,
      autorNome: autor.nome,
      criadoEm: '2026-05-20T09:00:00.000Z',
    }),
    new Noticia({
      titulo: 'Feira agropecuaria do Vale do Pianco tem recorde de visitantes',
      resumo: 'Evento reuniu produtores de toda a regiao no ultimo final de semana.',
      conteudo:
        'A feira agropecuaria da regiao do Vale do Pianco registrou o maior publico dos ultimos anos. Produtores rurais de varios municipios apresentaram seus produtos e o evento contou com palestras tecnicas sobre agricultura familiar e criacao de pequenos animais.',
      categoriaId: categorias.find((c) => c.nome === 'Regiao do Vale do Pianco').id,
      autorId: autor.id,
      autorNome: autor.nome,
      criadoEm: '2026-06-10T14:30:00.000Z',
    }),
    new Noticia({
      titulo: 'Congresso Nacional retoma pauta economica nesta semana',
      resumo: 'Deputados devem votar projetos relacionados ao ajuste fiscal.',
      conteudo:
        'O Congresso Nacional retoma nesta semana a discussao sobre a pauta economica, com destaque para projetos relacionados ao ajuste fiscal e a reforma tributaria. Lideres partidarios se reuniram para definir a ordem de votacao dos proximos dias.',
      categoriaId: categorias.find((c) => c.nome === 'Politica Nacional').id,
      autorId: autor.id,
      autorNome: autor.nome,
      criadoEm: '2026-04-15T10:00:00.000Z',
    }),
  ];
  noticias.forEach((n) => noticiaRepo.adicionar(n));
  console.log(`Noticias criadas: ${noticias.length}`);
}

console.log('Seed concluido.');
