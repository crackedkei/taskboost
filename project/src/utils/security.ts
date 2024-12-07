import { AES, enc } from 'crypto-js';
import DOMPurify from 'dompurify';

const SECRET_KEY = crypto.randomUUID();

// データの暗号化
export const encrypt = (data: string): string => {
  return AES.encrypt(data, SECRET_KEY).toString();
};

// データの復号化
export const decrypt = (encryptedData: string): string => {
  const bytes = AES.decrypt(encryptedData, SECRET_KEY);
  return bytes.toString(enc.Utf8);
};

// 入力のサニタイズ
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input);
};

// レート制限の実装
const LIMIT_WINDOW = 60000; // 1分
const MAX_REQUESTS = 100;
const requestLog = new Map<string, number[]>();

export const checkRateLimit = (actionType: string): boolean => {
  const now = Date.now();
  const requests = requestLog.get(actionType) || [];
  
  // 時間枠外のリクエストを削除
  const validRequests = requests.filter(time => now - time < LIMIT_WINDOW);
  
  if (validRequests.length >= MAX_REQUESTS) {
    return false;
  }
  
  validRequests.push(now);
  requestLog.set(actionType, validRequests);
  return true;
};

// セキュアなデータ共有のための圧縮と展開
export const compressData = (data: any): string => {
  const jsonString = JSON.stringify(data);
  const compressed = btoa(encodeURIComponent(jsonString));
  return encrypt(compressed);
};

export const decompressData = (encodedData: string): any => {
  const decrypted = decrypt(encodedData);
  const decompressed = decodeURIComponent(atob(decrypted));
  return JSON.parse(decompressed);
};