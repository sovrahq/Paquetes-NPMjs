import {
  IES256kKeyPair,
  IES256kSuite,
  LANG,
  VCSuite,
  suiteDecorator,
  Suite,
  BaseConverter,
  IJWK,
  Base,
} from "@sovra/kms-core";
import { ethers, wordlists, Wallet, utils } from "ethers";

@suiteDecorator(Suite.ES256k)
export class ES256kSuite implements IES256kSuite {
  private wallet: Wallet;

  constructor() { }

  async verifySignature(originalContent: string, flatSignature: any, publicKey: IJWK): Promise<boolean> {
    // Verificar el token
    const address = ethers.utils.verifyMessage(originalContent, flatSignature);

    const publicKeyHex = BaseConverter.convert(publicKey, Base.JWK, Base.Hex) as IJWK;

    const pbkAddress = this.publicKeyToAddress(publicKeyHex);

    return pbkAddress == address;
  }

  private publicKeyToAddress(publicKeyHex) {
     // Calcular el hash Keccak-256 de la clave pública (omitir el byte inicial '04' si está presente)
     const publicKeyHash = ethers.utils.keccak256(publicKeyHex);
 
     // Tomar los últimos 20 bytes (40 caracteres) del hash
     const addressBytes = publicKeyHash.slice(-40);
 
     // Convertir a una dirección Ethereum con checksum
     const address = ethers.utils.getAddress(addressBytes);
     
     return address;
  }

  async load(secret: IES256kKeyPair): Promise<void> {
    if (secret.privateKey) {
      this.wallet = new Wallet(secret.privateKey);
    } else if (secret.mnemonic) {
      this.wallet = Wallet.fromMnemonic(secret.mnemonic);
    }
  }

  async create(params?: { lang: LANG }): Promise<IES256kKeyPair> {
    // TODO: Add support for other languages, if params null wordlist.es is used
    const lang = params?.lang ?? LANG.es;

    switch (lang) {
      case LANG.es:
        this.wallet = ethers.Wallet.createRandom({ locale: wordlists.es });
        break;
      case LANG.en:
        this.wallet = ethers.Wallet.createRandom({ locale: wordlists.en });
        break;
      case LANG.fr:
        this.wallet = ethers.Wallet.createRandom({ locale: wordlists.fr });
        break;
      case LANG.it:
        this.wallet = ethers.Wallet.createRandom({ locale: wordlists.it });
        break;
    }

    const key = this.wallet._signingKey();

    return {
      privateKey: key.privateKey,
      publicKey: key.publicKey,
      curve: key.curve,
      mnemonic: this.wallet.mnemonic.phrase,
    };
  }

  async sign(content: string): Promise<string> {
    if (!this.wallet)
      throw new Error(
        "Cannot sign content because wallet was not initialized with secrets."
      );

    // Raw ECDSA signing for Sidetree JWS (no Ethereum message prefix)
    const hash = ethers.utils.sha256(ethers.utils.toUtf8Bytes(content));
    const sig = this.wallet._signingKey().signDigest(hash);
    const rBytes = Buffer.from(ethers.utils.arrayify(sig.r));
    const sBytes = Buffer.from(ethers.utils.arrayify(sig.s));
    const sigBuffer = Buffer.alloc(64);
    rBytes.copy(sigBuffer, 32 - rBytes.length);
    sBytes.copy(sigBuffer, 64 - sBytes.length);
    return sigBuffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
}
