
import 'dotenv/config';

if (!process.env.PRIVATE_KEY) {
    throw new Error(
        'PRIVATE_KEY is not defined and must be set in the .env file'
    );
}


export const config = {

    //conatains a list of tokens to monitor for addLiquidity
    TOKENS_TO_MONITOR: [
        "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
        "0x55d398326f99059fF775485246999027B3197955"
    ],

    TG_USERS_ID: [],

    /**
     * @description PRIVATE_KEY is the private key of the account that will be used to sign transactions
     */
    PRIVATE_KEY: process.env.PRIVATE_KEY!,
    /**
     * @description JSON RPC endpoint
     * @type {string}
     */
    JSON_RPC: process.env.JSON_RPC!,

    /**
     * @description WSS_URL is the websocket endpoint of the WSS  endpoint
     */

    WSS_URL: process.env.WSS_URL!,

    BSCSCAN_API_KEY: process.env.BSCSCAN_API_KEY!,
    WBNB_ADDRESS: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    PUBLIC_KEY: process.env.PUBLIC_KEY!,
    SUPPORTED_ROUTERS: ['0x10ED43C718714eb63d5aA57B78B54704E256024E'],

    PANCAKESWAP_ROUTER: '0x10ED43C718714eb63d5aA57B78B54704E256024E',

    RUGCHECKER_CONTRACT: '0xbBCB85f038Dc8C8ac0123611C4E0f1CcD748ba6e',

    RUGCHECKER_API: 'https://therugcheck.com/bsc/?address=0xbBCB85f038Dc8C8ac0123611C4E0f1CcD748ba6e',

    BNB_BUY_AMOUNT: 0.00001 * 1e18,

    MINIMUM_BUY_TAX: 0,

    MINIMUM_SELL_TAX: 0

}