// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import { Base64 } from "./libraries/Base64.sol";

contract MyEpicNFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  string baseSvg1 = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 100'><style>.base { fill: #";
  string baseSvg2 = "; font-family: &apos;Press Start 2P&apos;; font-size: 14px; }</style><rect width='100%' height='100%' fill='#262626' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

  string[] colors = ["2DD2FF", "45E773", "FFDD00"];
  string[] firstWords = ["today"];
  string[] secondWords = ["Iwill"];
  string[] thirdWords = ["Fart", "Poo", "Pee", "Meditate", "SetGoals", "CareMyself", "BeGrateful", "BeGreat", "Learn", "ThankMom", "ThankDad", "Exercise", "Focus", "Reflect", "Journal"];

  event NewEpicNFTMinted(address sender, uint256 tokenId);

  constructor() ERC721 ("ActionNFT", "ACTION") {
    console.log("act today, do not wait tmrw! share your results on twitter w/ @verci_eth");
  }

  function pickRandomColor(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("COLOR", Strings.toString(tokenId))));
    rand = rand % colors.length;
    return colors[rand];
  }

  function pickRandomFirstWord(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
    rand = rand % firstWords.length;
    return firstWords[rand];
  }

  function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
    rand = rand % secondWords.length;
    return secondWords[rand];
  }

  function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
    rand = rand % thirdWords.length;
    return thirdWords[rand];
  }

  function random(string memory input) internal pure returns (uint256) {
      return uint256(keccak256(abi.encodePacked(input)));
  }

  function makeAnEpicNFT() public {
    uint256 newItemId = _tokenIds.current();

    string memory color = pickRandomColor(newItemId);
    string memory first = pickRandomFirstWord(newItemId);
    string memory second = pickRandomSecondWord(newItemId);
    string memory third = pickRandomThirdWord(newItemId);
    string memory combinedWord = string(abi.encodePacked(first, second, third));

    string memory finalSvg = string(abi.encodePacked(baseSvg1, color, baseSvg2, combinedWord, "</text></svg>"));

    string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                    '{"name": "',
                    combinedWord,
                    '", "description": "act today, do not wait tmrw! share your results on twitter w/ @verci_eth", "image": "data:image/svg+xml;base64,',
                    Base64.encode(bytes(finalSvg)),
                    '"}'
                )
            )
        )
    );

    string memory finalTokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
    );

    console.log("\n--------------------");
    console.log(finalTokenUri);
    console.log("--------------------\n");

    _safeMint(msg.sender, newItemId);
    _setTokenURI(newItemId, finalTokenUri);
  
    _tokenIds.increment();
    console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
    emit NewEpicNFTMinted(msg.sender, newItemId);
  }
}