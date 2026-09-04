export default class Configuracao {
  #canalYoutubeId;
  #videoDestaqueId;

  constructor({ canalYoutubeId = '', videoDestaqueId = '' } = {}) {
    this.#canalYoutubeId = canalYoutubeId || '';
    this.#videoDestaqueId = videoDestaqueId || '';
  }

  get canalYoutubeId() { return this.#canalYoutubeId; }
  get videoDestaqueId() { return this.#videoDestaqueId; }

  toJSON() {
    return {
      canalYoutubeId: this.#canalYoutubeId,
      videoDestaqueId: this.#videoDestaqueId,
    };
  }
}
