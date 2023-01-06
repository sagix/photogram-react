export default class Uuidv4 {

  constructor(crypto) {
    this._crypto = crypto;
  }

  static create() {
    return new Uuidv4(crypto)
  }

  static createNull() {
    return new Uuidv4(new SubbedCrypto())
  }

  generate() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (((c ^ this._crypto.getRandomValues(new Uint8Array(1))[0]) & 15) >> c / 4).toString(16)
    )
  }
}

class SubbedCrypto {
  getRandomValues() {
    return [0];
  }
}