import { getDefaultProvider, Wallet } from 'ethers'; // ethers v5
import { Provider, TransactionResponse } from '@ethersproject/providers'; // ethers v5
import { erc721PermissionedMintable } from '@imtbl/sdk';

const CONTRACT_ADDRESS = '0x1511008CB9Ca2835DB7DbAC3b7FB46224cE64d32';
const PRIVATE_KEY = '7e0358e9bb88ddf2e3baaa9a998d2103f29845ded5bfad0a0c9bde2902d94709';
const provider = getDefaultProvider('https://rpc.testnet.immutable.com');

const mint = async (provider: Provider): Promise<TransactionResponse> => {
  // Bound contract instance
  const contract = new erc721PermissionedMintable.ERC721PermissionedMintable(CONTRACT_ADDRESS);
  // The wallet of the intended signer of the mint request
  const wallet = new Wallet(PRIVATE_KEY, provider);
  // We can use the read function hasRole to check if the intended signer
  // has sufficient permissions to mint before we send the transaction
  const minterRole = await contract.MINTER_ROLE(provider);
  const hasMinterRole = await contract.hasRole(
    provider,
    minterRole,
    wallet.address
  );

  if (!hasMinterRole) {
    // Handle scenario without permissions...
    console.log('Account doesnt have permissions to mint.');
    return Promise.reject(
      new Error('Account doesnt have permissions to mint.')
    );
  }
  // Specify who we want to receive the minted token
  const recipient = wallet.address;

  // Choose an ID for the new token
  const nextTokenId = 4; //(await contract.totalSupply(provider)).add(1);
  
  // Rather than be executed directly, contract write functions on the SDK client are returned
  // as populated transactions so that users can implement their own transaction signing logic.
  const populatedTransaction = await contract.populateMint(recipient, nextTokenId);
  const result = await wallet.sendTransaction(populatedTransaction);
  console.log(result) // To get the TransactionResponse value
  return result;
};

mint(provider);