import { Storage } from '@google-cloud/storage';
import { ethers } from 'ethers';
import { credentialConfig } from './credential-config.ts';
import { decryptSymmetric } from './kms-decrypt.ts';

const providers = ethers.providers;
const Wallet = ethers.Wallet;

// The ID of the GCS bucket holding the encrypted keys
const bucketName = process.env.KEY_BUCKET;

// Name of the encrypted key files.
const encryptedKeyFile1 = 'alice-encrypted-key-share';
const encryptedKeyFile2 = 'bob-encrypted-key-share';

// Create a new storage client with the credentials
const storageWithCreds = new Storage({
  credentials: credentialConfig,
});

// Create a new storage client without the credentials
const storage = new Storage();

const downloadIntoMemory = async (keyFile: any) => {
  // Downloads the file into a buffer in memory.
  const contents = await storageWithCreds.bucket(bucketName!).file(keyFile).download();

  return contents;
};

const provider = new providers.JsonRpcProvider(`http://${process.env.NODE_URL}:80`);

/**
 * トランザクションに署名するメソッド
 * @param unsignedTransaction 
 * @returns 
 */
export const signTransaction = async (unsignedTransaction: any) => {
  /* Check if Alice and Bob have both approved the transaction
  For this example, we're checking if their encrypted keys are available. */
  const encryptedKey1 = await downloadIntoMemory(encryptedKeyFile1).catch(console.error);
  const encryptedKey2 = await downloadIntoMemory(encryptedKeyFile2).catch(console.error);

  // For each key share, make a call to KMS to decrypt the key
  const privateKeyshare1 = await decryptSymmetric(encryptedKey1![0]);
  const privateKeyshare2 = await decryptSymmetric(encryptedKey2![0]);

  /* Perform the MPC calculations
  In this example, we're combining the private key shares
  Alternatively, you could import your mpc calculations here */

  // シェアから秘密鍵を生成
  const wallet = new Wallet(privateKeyshare1 + privateKeyshare2);

  // Sign the transaction
  const signedTransaction = await wallet.signTransaction(unsignedTransaction);

  return signedTransaction;
};

/**
 * 署名済みトランザクションを送信するメソッド
 * @param signedTransaction 
 * @returns 
 */
export const submitTransaction = async (signedTransaction: any) => {
  // This can now be sent to Ganache
  const hash = await provider.sendTransaction(signedTransaction);
  return hash;
};

/**
 * バケットにデータをアップロードするメソッド
 * @param contents 
 */
export const uploadFromMemory = async (contents: any) => {
  // Upload the results to the bucket without service account impersonation
  await storage.bucket(process.env.RESULTS_BUCKET!)
      .file('transaction_receipt_' + Date.now())
      .save(JSON.stringify(contents));
};