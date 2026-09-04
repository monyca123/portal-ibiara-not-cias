import { db } from '../db.js';
import Configuracao from '../models/Configuracao.js';

export class ConfiguracaoRepository {
  obter() {
    const row = db.prepare('SELECT * FROM configuracoes WHERE id = ?').get('global');
    if (!row) return new Configuracao();
    return new Configuracao({ canalYoutubeId: row.canal_youtube_id, videoDestaqueId: row.video_destaque_id });
  }

  salvar(configuracao) {
    db.prepare(
      `INSERT INTO configuracoes (id, canal_youtube_id, video_destaque_id)
       VALUES ('global', ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         canal_youtube_id = excluded.canal_youtube_id,
         video_destaque_id = excluded.video_destaque_id`
    ).run(configuracao.canalYoutubeId, configuracao.videoDestaqueId);
    return configuracao;
  }
}

export default new ConfiguracaoRepository();
