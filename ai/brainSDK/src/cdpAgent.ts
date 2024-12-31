import { brianCDPToolkit } from "./tools";

/**
 * メイン関数
 */
const main = async() => {
    const tools = await brianCDPToolkit.setup({});
    console.log(tools)
}

main();