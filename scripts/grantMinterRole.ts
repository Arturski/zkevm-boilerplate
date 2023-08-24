import { getDefaultProvider, Wallet } from "ethers"; // ethers v5
import { Provider, TransactionResponse } from "@ethersproject/providers";  // ethers v5
import { erc721PermissionedMintable } from "@imtbl/sdk";

const CONTRACT_ADDRESS = "0x1511008CB9Ca2835DB7DbAC3b7FB46224cE64d32";
const PRIVATE_KEY = "7e0358e9bb88ddf2e3baaa9a998d2103f29845ded5bfad0a0c9bde2902d94709";
const provider = getDefaultProvider("https://rpc.testnet.immutable.com");

const grantMinterRole = async (
    provider: Provider
): Promise<TransactionResponse> => {
    // Bound contract instance
    const contract = new erc721PermissionedMintable.ERC721PermissionedMintable(CONTRACT_ADDRESS);
    // The wallet of the intended signer of the mint request
    const wallet = new Wallet(PRIVATE_KEY, provider);

    // Give the wallet minter role access
    const populatedTransaction = await contract.populateGrantMinterRole(
        wallet.address
    );
    const result = await wallet.sendTransaction(populatedTransaction);
    return result;
};

grantMinterRole(provider);