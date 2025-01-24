import CryptoJS from "crypto-js";

/**
 * Ma'lumotni AES bilan shifrlash
 * @param {string} data - Shifrlanadigan ma'lumot
 * @param {string} secretKey - Maxfiy kalit
 * @returns {string} - Shifrlangan ma'lumot
 */
export const encryptData = (data, secretKey) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

/**
 * AES bilan shifrlangan ma'lumotni deshifrlash
 * @param {string} encryptedData - Shifrlangan ma'lumot
 * @param {string} secretKey - Maxfiy kalit
 * @returns {string} - Deshifrlangan ma'lumot
 */
export const decryptData = (encryptedData, secretKey) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8); // UTF-8 formatida asl ma'lumotni qaytaradi
};


