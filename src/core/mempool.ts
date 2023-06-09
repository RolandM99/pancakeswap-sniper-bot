import {
    constants,
    Contract,
    ethers,
    providers,
    utils,
    Wallet,
} from 'ethers';
import { config } from '../config/config';
import { PANCAKESWAP_ABI } from '../utils/abiPancakeswap';
import { SwapsWrapper } from './swaps'
// import { sendNotification } from '../telegram';
import { HelpersWrapper } from '../utils/helpers';

export const streamMempool = async () => {

const wsprovider = new providers.WebSocketProvider(config.WSS_URL);
const pancakeSwap = new ethers.utils.Interface(PANCAKESWAP_ABI);
const provider = new providers.JsonRpcProvider(config.JSON_RPC);
const signer = new Wallet(config.PRIVATE_KEY, provider);

const contract = new Contract(
  config.PANCAKESWAP_ROUTER,
  PANCAKESWAP_ABI,
  signer
);


   const streamingMempoolData = async () => {
        // mempool monitoring
        wsprovider.on('pending', async (txHash: string) => {
            try {
                let receipt = await wsprovider.getTransaction(txHash);

                receipt?.hash && process(receipt);
            } catch (error) {
                console.error(`Error`, error);
            }
        });
    };


    const process = async (receipt: providers.TransactionResponse) => {
        //process transaction implementation

        try {
            if(receipt.to?.toLowerCase() === config.PANCAKESWAP_ROUTER.toLowerCase()){
                console.log("Transaction is a swap")

                let {
                    value: targetAmountInWei,
                    to: router,
                    gasPrice: targetGasPriceInWei,
                    gasLimit: targetGasLimit,
                    hash: targetHash,
                    from: targetFrom,
                } = receipt

                console.info(`
                AmountInWei: ${targetAmountInWei}
                Transaction Hash: ${targetHash}
                Address: ${targetFrom}, 
                Gas Price: ${(targetGasPriceInWei?.div(1e9).toString())} Gwei
                Router: ${router} 
                Gas Limit: ${targetGasLimit}`)

        

            let tokensToMonitor = config.TOKENS_TO_MONITOR.map((token: string) => token.toLowerCase());


            try {
                //parse transaction data to get the method name and arguments and decode the data
                const txData = pancakeSwap.parseTransaction({
                    data: receipt.data,
                });

                //desctructure transaction  data to get methodeName 
                let { name: targetMethodName, args: targetArgs } = txData;

                let { path } = targetArgs;

                let targetToToken = path[path.length - 1];
                let gasPrice = utils.formatUnits(targetGasPriceInWei!.toString())

                //if the path is undefined stop execution and return
                if (!path) return;


                console.info({
                    targetMethodName,
                    path,
                    gasPrice,
                    targetHash,
                    targetFrom

                })


                //preprare simulation data



                if (targetMethodName.startsWith("addLiquidity")) {

                    let tokenToBuy;
                    let tokenA = targetArgs.tokenA
                    let tokenB = targetArgs.tokenB

                    if (tokensToMonitor.includes(tokenA.toLowerCase())) {
                        tokenToBuy = tokenA
                    } else if (tokensToMonitor.includes(tokenB.toLowerCase())) {
                        tokenToBuy = tokenB
                    }
                    if (tokenToBuy) {




                        //check if token is verified
                        const verifyToken = await HelpersWrapper.isVerified(tokenToBuy);


                       /* function which will be implemented later here: for checking if the token is a scam by using the address from the rugcheck api
                       */


                        if (verifyToken) {


                            //TODO execute a buy order for the token

                            const path = [config.WBNB_ADDRESS, tokenToBuy]

                            const nonce = await HelpersWrapper.getNonce();

                            let overLoads: any = {
                                gasLimit: targetGasLimit,
                                gasPrice: gasPrice,
                                nonce: nonce!
                            }


                            let buyTx = await SwapsWrapper.swapExactETHForTokensSupportingFeeOnTransferTokens({
                                amountOutMin: 0,
                                bnbAmount: config.BNB_BUY_AMOUNT,
                                path: path,
                                overLoads: overLoads
                            })

                                if (buyTx.sucess == true) {

                                    //get confrimation receipt before approving 
                                    const receipt = await provider.getTransactionReceipt(buyTx.data)

                                    if (receipt && receipt.status == 1) {

                                        overLoads["nonce"] += 1
                                        //approving the tokens
                                        await SwapsWrapper.approve({
                                            tokenAddress: tokenToBuy,
                                            overLoads: overLoads
                                        })


                                        console.log("WAITING FOR SELLING")
                                    }

                                }                           

                        }


                    }

                } else if (targetMethodName.startsWith("addLiquidityETH")) {

                    let tokenToBuy = targetArgs.token

                    if (tokenToBuy) {

                        // send notification to telegram*******

                        // await sendNotification(message)


                        //check if token is verified
                        const verifyToken = await HelpersWrapper.isVerified(tokenToBuy);



                        if (verifyToken) {

                                // execute a buy order for the token

                                const path = [config.WBNB_ADDRESS, tokenToBuy]
                                const nonce = await HelpersWrapper.getNonce();

                                let overLoads: any = {
                                    gasLimit: targetGasLimit,
                                    gasPrice: gasPrice,
                                    nonce: nonce!
                                }


                                let buyTx = await SwapsWrapper.swapExactETHForTokensSupportingFeeOnTransferTokens({
                                    amountOutMin: 0,
                                    bnbAmount: config.BNB_BUY_AMOUNT,
                                    path: path,
                                    overLoads: overLoads
                                })

                                if (buyTx.sucess == true) {

                                    //get confrimation receipt before approving 
                                    const receipt = await provider.getTransactionReceipt(buyTx.data)

                                    if (receipt && receipt.status == 1) {


                                        overLoads["nonce"] += 1

                                        //approving the tokens
                                        await SwapsWrapper.approve({
                                            tokenAddress: tokenToBuy,
                                            overLoads: overLoads
                                        })


                                        console.log("WAITING FOR SELLING")
                                    }

                                }


                        }


                    }

                }


            } catch (error) {
                console.log(`Error, ${error}`);
            }
        }

        }
        catch(error){
            console.log(`Error, ${error}`);
        }

    }

    streamingMempoolData()
}