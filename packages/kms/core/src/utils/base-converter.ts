let multibase = require("multibase");
let bs58 = require("bs58");
import { base64url as base64urlformats } from "multiformats/bases/base64";
import { TextDecoder } from "text-encoding";

export enum Base {
  Hex = "hex",
  Base58 = "base58",
  Base64 = "base64",
  JWK = "jwk",
}

export interface IJWK {
  kty: string;
  crv: string;
  x: string;
  y?: string;
}

export class BaseConverter {
  private static hex2base64url(dataHex) {
    const buffer = Buffer.from(dataHex, "hex");
    const base64 = buffer.toString("base64");
    const base64url = base64
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    return base64url;
  }

  public static getPrivateJWKfromHex(_privKey: string, pubKey: string) {
    let privKey = _privKey;
    // remove 0x and 0x04 to be used in jose library

    privKey = privKey.replace("0x", "");
    pubKey = pubKey.replace("0x04", "");

    return {
      crv: "secp256k1",
      kty: "EC",
      d: BaseConverter.hex2base64url(privKey),
      x: BaseConverter.hex2base64url(pubKey.substr(0, 64)),
      y: BaseConverter.hex2base64url(pubKey.substr(64, 64))
    };
  }

  static convert(value: any, fromBase: Base, toBase: Base, keyType?: string) {
    if (fromBase == Base.Base58 && toBase == Base.Hex) {
      const hex = this.toHexString(bs58.decode(value));
      return hex;
    }
    if (fromBase == Base.Hex && toBase == Base.Base58) {
      return bs58.encode(Buffer.from(value, "hex"));
    }
    if (fromBase == Base.Hex && toBase == Base.JWK) {
      return this.hexToJWK(value, keyType);
    }
    if (fromBase == Base.JWK && toBase == Base.Hex) {
      return this.JWKToHex(value);
    }
    if (fromBase == Base.Base58 && toBase == Base.JWK) {
      const hex = this.toHexString(bs58.decode(value));
      return this.hexToJWK(hex, keyType);
    }
    if (fromBase == Base.JWK && toBase == Base.Base58) {
      return bs58.encode(Buffer.from(this.JWKToHex(value).replace("0x", ""), "hex"));
    }
  }

  private static hexToJWK(value: string, keyType: string) {
    // OKP support (Ed25519 / X25519) — x-only, no y
    if (keyType === 'OKP' || keyType === 'Ed25519' || keyType === 'X25519') {
      const hex = value.replace('0x04', '').replace('0x', '');
      const xBuf = Buffer.from(hex, 'hex');
      const crv = keyType === 'X25519' ? 'X25519' : 'Ed25519';
      const b64 = xBuf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      return { kty: 'OKP', crv, x: b64 };
    }

    value = value.replace("0x04", "");
    value = value.replace("0x", "");

    return {
      kty: "EC",
      crv: keyType,
      x: this.base64url(
        Buffer.from(value.substring(0, value.length / 2), "hex")
      ),
      y: this.base64url(Buffer.from(value.substring(value.length / 2), "hex")),
    };
  }

  private static base64url(buffer: Uint8Array) {
    const decoder = new TextDecoder();
    const bytes = multibase.encode("base64url", buffer);
    return decoder.decode(bytes).slice(1);
  }

  private static JWKToHex(value: {
    kty: string;
    crv: string;
    x?: string;
    y?: string;
    n?: string;
  }) {
    // OKP support (Ed25519, X25519) — only x, no y
    if (value.kty === 'OKP' || value.crv === 'Ed25519' || value.crv === 'X25519') {
      const xStr = value.x || '';
      let padded = xStr.replace(/-/g, '+').replace(/_/g, '/');
      while (padded.length % 4) padded += '=';
      return '0x' + Buffer.from(padded, 'base64').toString('hex');
    }

    if (value.kty == "RSA" && value.n) {
      return `0x${Buffer.from(base64urlformats.baseDecode(value.n)).toString("hex")}`
    }
    else if (value.x && value.y) {
      const b1 = Buffer.from(base64urlformats.baseDecode(value.x)).toString(
        "hex"
      );
      const b2 = Buffer.from(base64urlformats.baseDecode(value.y)).toString(
        "hex"
      );
      return `0x${b1}${b2}`;
    }

    throw new Error("This JWK To Hex conversion is not supported: " + JSON.stringify(value));
  }

  private static fromHexString = (hexString) =>
    Uint8Array.from(
      hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );

  private static toHexString = (bytes) =>
    bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
}
