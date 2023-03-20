require('dotenv').config()
import { ethers, providers } from 'ethers'

const streamingMempoolData = async () => {
    try {
        const _wsprovider = new ethers.providers.WebSocketProvider(process.env.WSS_URL!);

        _wsprovider.on('pending', async (txHash: string) => {
            try {

                let receipt = await _wsprovider.getTransaction(txHash);

                receipt?.hash && _process(receipt);

            } catch (error) {
                console.error(`Error`, error);
            }
        });


        const _process = async (receipt: providers.TransactionResponse) => {
            let {
                value: targetAmountInWei,
                to: router,
                gasPrice: targetGasPriceInWei,
                gasLimit: targetGasLimit,
                hash: targetHash,
                from: targetFrom,
            } = receipt

            try {
                console.info(`
                AmountInWei: ${targetAmountInWei}
                Transaction Hash: ${targetHash}
                Address: ${targetFrom}, 
                Gas Price: ${(targetGasPriceInWei?.div(1e9).toString())} Gwei
                Router: ${router} 
                Gas Limit: ${targetGasLimit}`)

            } catch (error) {
                console.log("Error processing mempool data: ", error)
            }
        }

    } catch (error) {
        console.log("Error streaming mempool data: ", error)
    }
}


streamingMempoolData()