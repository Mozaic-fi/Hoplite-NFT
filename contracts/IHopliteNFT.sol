// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

interface IHopliteNFT {
    function setBaseURI(string memory baseURI) external;
    function setDefaultRoyalty(address receiver, uint96 newRoyalty) external;
    function deleteDefaultRoyalty() external;
    function setTokenRoyalty(uint256 tokenId, address receiver, uint96 newRoyalty) external;
    function resetTokenRoyalty(uint256 tokenId) external;
    function updateWhiteList(address[] memory _whiteListUsers) external;
    function removeWhiteList(address[] memory _whiteListUsers) external;
}
