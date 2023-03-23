import axios from "axios";
import { Contract, providers, utils, Wallet } from "ethers";
import  { config } from "../config/config";
import { PANCAKESWAP_ABI } from "./abiPancakeswap"
import { RUGCHECKER_ABI } from "./rugchecker";


export class Helpers {

    private _provider: providers.JsonRpcProvider;
    signer: Wallet;

    constructor() {
        // initialize some variables i.e provider, signers
        this._provider = new providers.JsonRpcProvider(config.JSON_RPC);
        this.signer = new Wallet(config.PRIVATE_KEY, this._provider);
    }

    /**
    *  @param walletAddress the walletAddress to get the nonce for
    * @returns nonce of the walletAddress
    */
    getNonce = async () => {
        try {
            return await this._provider.getTransactionCount(config.PUBLIC_KEY);

        } catch (error) {
            console.log('Could not fetch wallet Nonce', error);
        }
    }

    /**
    * 
    * @returns the contract instance of the pancakeSwap contract
    */
    pancakeSwapContract = () => {
        return new Contract(config.PANCAKESWAP_ROUTER, PANCAKESWAP_ABI, this.signer);
    }
    /**
     * 
     * @param _tokenAddress the token address to get the allowance for
     * @returns 
     */
    approveContract = async (tokenAddress: string) => {
        return new Contract(tokenAddress,
            ["function approve(address _spender, uint256 _value) public returns (bool success)"],
            this.signer);
    }


    /**
     * 
     * @returns the contract instance of the rugChecker contract
     */

    simulationContract = () => {
        return new Contract(
            config.RUGCHECKER_CONTRACT,
            RUGCHECKER_ABI,
            this.signer);
    }

    /**
  * 
  * @param tokenAddress the token address to get the balance for
  * @returns the balance of the tokenAddress
  */
    getTokenBalance = async (tokenAddress: string, owner: string) => {
        try {

            const tokenContract = new Contract(tokenAddress, PANCAKESWAP_ABI, this._provider);

            return await tokenContract.balanceOf(owner);

        } catch (error) {
            console.log('Error fecthing Token Balance ', error);
        }
    }

    /**
     * 
     * @param error the error to be logged
     * @returns
     */

    parseError = (error: any) => {
        let msg = '';
        try {
            error = JSON.parse(JSON.stringify(error));
            msg =
                error?.error?.reason ||
                error?.reason ||
                JSON.parse(error)?.error?.error?.response?.error?.message ||
                error?.response ||
                error?.message ||
                error;
        } catch (_error: any) {
            msg = error;
        }

        return msg;
    };


    /**
     * 
     * @param _params the params to be passed to the function to check if token is rug, it's sell and buy tax
     * @returns 
     */

    calculateTax = async (_params: { swapRouter: string, swapPath: Array<string>, SwapAmountIn: any }):
        Promise<{ buyTax: any | undefined, sellTax: any | undefined }> => {

        const { swapRouter, swapPath, SwapAmountIn } = _params;

        try {


            const simulate = this.simulationContract();

            const response = await simulate.callStatic.screen(swapRouter, swapPath, SwapAmountIn, {
                gasLimit: 1000000,
            });


            // const { estimatedBuy, actualBuy, estimatedSell, actualSell, buyGas, sellGas, token } = response;

            const estimatedBuy = parseInt(response.estimatedBuy);
            const actualBuy = parseInt(response.actualBuy);
            const estimatedSell = parseInt(response.estimatedSell);
            const actualSell = parseInt(response.actualSell);
            const buyGas = parseInt(response.buyGas);
            const sellGas = parseInt(response.sellGas);

            const token = response.token;

            let buyTax, sellTax;

            console.log({ estimatedBuy, actualBuy, estimatedSell, actualSell, sellGas, buyGas, token });

            if (estimatedBuy > actualBuy) {

                buyTax = ((estimatedBuy - actualBuy) / ((estimatedBuy + actualBuy) / 2)) * 100;
            }

            if (estimatedSell > actualSell) {

                sellTax = ((estimatedSell - actualSell) / ((estimatedSell + actualSell) / 2)) * 100;

            }

            return { buyTax, sellTax };

        } catch (error) {

            error = this.parseError(error);
            console.log('Error calculating tax', error);
            return { buyTax: 0, sellTax: 0 };

        }
    }

    /**
     * 
     * @param contractaddress the token address to check if its's verified from bsc scan
     * @returns OK if the token is verified
     */

    isVerified = async (contractAddress: string) => {
        try {
            const data = await axios.get(`https://api.bscscan.com/api?module=contract&action=getabi&address=${contractAddress}&apikey=${config.BSCSCAN_API_KEY}`);

            const { status, message } = data.data;

            if (status === '1') {

                console.log('Messafe for contract  verification: ', message);
                return true;
            } else {
                console.log('Token  contract  verification Failed: ', message);
            }


        } catch (error) {
            error = this.parseError(error);
            console.log('Error checking if token is verified', error);
        }

    }

    /**
     * 
     * @param contractaddress the token address to get the total supply for
     * @returns the total supply of the token
     */
    totalSupply = async (contractaddress: string) => {
        try {

            const data = await axios.get(`https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=${contractaddress}&apikey=${config.BSCSCAN_API_KEY}`)

            const { result } = data.data;

            console.log('The TotalSupply of Tokens ', result);

            return utils.formatUnits(result)

        } catch (error) {
            error = this.parseError(error);
            console.log('Error fecthing Token Balance ', error);
        }
    }


    /**
     * 
     * @param contractaddress the token to check ownership for
     * @returns contract owner| Deployer balance of the token
     */
    isContractOwnerBalance = async (contractaddress: string) => {

        try {

            const data = await axios.get(`https://api.bscscan.com/api?module=contract&action=getcontractcreation&contractaddresses=${contractaddress}&apikey=${config.BSCSCAN_API_KEY}`)

            const { result } = data.data;

            const { contractCreator } = result[0];

            console.log('Contract Deployer', contractCreator);

            //check for the balance the owner has in the contract

            const balance = await this.getTokenBalance(contractaddress, contractCreator);

            return utils.formatUnits(balance)

        } catch (error) {

            console.log('Error fecthing Token Balance ', error);
        }
    }


}


export const HelpersWrapper = new Helpers();



