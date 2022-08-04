const { ethers } = require("ethers");
const fs = require('fs');
const path = require("path");
const artifact = require("../artifacts/DropGenerativeArt.json");
require('dotenv').config();

const provider_rinkeby = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_RINKEBY);

const contract = new ethers.Contract("0x1E3C4c2ffD663a7e26cF4c9478F12556b57Fd43C", artifact.abi, provider_rinkeby);

const getScript = async (tokenId) => {
    const scriptStr = await contract.script();
    const hash = await contract.tokenToHash(parseInt(tokenId));
    const x = `const tokenData = {
        hash: "${hash}",
        tokenId: ${tokenId}
    }
    `;
    
    fs.writeFile(path.resolve(__dirname, "../public/token/js/pieces/mySketch.js"), x + scriptStr.toString(), 'utf8', () => console.log("done"));
}

module.exports = { getScript };