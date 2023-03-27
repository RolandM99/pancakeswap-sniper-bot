
import 'dotenv/config';

if (!process.env.PRIVATE_KEY) {
    throw new Error(
        'PRIVATE_KEY is not defined and must be set in the .env file'
    );
}


export const config = {

    //conatains a list of tokens to monitor for addLiquidity
    TOKENS_TO_MONITOR: [
      "0xD26615b68a5c39A61db5c1fB66Fd6Cd7964064c8"
    ],

    TG_USERS_ID: ["1069843486"],

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
    WBNB_ADDRESS: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    PUBLIC_KEY: process.env.PUBLIC_KEY!,
    SUPPORTED_ROUTERS: ['0xD99D1c33F9fC3444f8101754aBC46c52416550D1'],

    PANCAKESWAP_ROUTER: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',

    RUGCHECKER_CONTRACT: '0xbBCB85f038Dc8C8ac0123611C4E0f1CcD748ba6e',

    RUGCHECKER_API: 'https://therugcheck.com/bsc/?address=0xbBCB85f038Dc8C8ac0123611C4E0f1CcD748ba6e',

    BNB_BUY_AMOUNT: 0.00001 * 1e18,

    MINIMUM_BUY_TAX: 0,

    MINIMUM_SELL_TAX: 0,

    TELEGRAM_BOT_API: process.env.TELEGRAM_BOT_API!,

}