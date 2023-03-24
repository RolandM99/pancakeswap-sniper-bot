import readline from "readline";
import { streamMempool } from "./core/mempool";

const main = async () => {
    try {
        console.log("\n\n ========= Starting MEMPOOL STREAM =========");
        await streamMempool();
    } catch (error) {
        console.log("Error starting mempool stream: ", error);
    }
}
main();