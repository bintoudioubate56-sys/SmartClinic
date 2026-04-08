declare module 'qrcode' {
  export interface QRCodeOptions {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }

  export function toDataURL(
    text: string | QRCodeSegment[],
    options?: QRCodeOptions
  ): Promise<string>;

  export interface QRCodeSegment {
    data: string;
    mode: 'alphanumeric' | 'numeric' | 'byte' | 'kanji';
  }
}
