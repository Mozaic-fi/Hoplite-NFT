const hre = require("hardhat");

async function main() {
    await hre.run("verify:verify", {
        address: "0x99c38fd4A88Db3699A6f21a40fF295Fa1e9F613A",
        constructorArguments: [],
    });
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});