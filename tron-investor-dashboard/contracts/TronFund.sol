// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface AggregatorInterface {
    function latestAnswer() external view returns (int256);
    function latestTimestamp() external view returns (uint256);
}

contract TronCrowdfunding {
    error contractFrozen();
    
    AggregatorInterface public priceFeed; // Price feed contract

    struct Campaign {
        address creator;
        string title;
        string description;
        uint256 fundingGoal;    // Funding goal in USDT
        uint256 totalDonationsTRX; // Total donations in TRX
        uint256 totalDonationsUSD; // Total donations converted to USD
        bool funded;
        bool frozen;
    }

    mapping(uint256 => Campaign) public campaigns; // Campaign ID to Campaign mapping
    uint256 public campaignCount; // Counter for the number of campaigns

    event CampaignCreated(uint256 indexed campaignId, address indexed creator, string title, string description, uint256 fundingGoal);
    event DonationReceived(uint256 indexed campaignId, address indexed donor, uint256 amount, bool isTRX);
    event CampaignFunded(uint256 indexed campaignId);

    modifier notFrozen(uint256 campaignId) {
        if (campaigns[campaignId].frozen) {
            revert contractFrozen();
        }
        _;
    }

    constructor(address _priceFeed) {
        priceFeed = AggregatorInterface(_priceFeed); // Price feed for USDT-USD
        campaignCount = 0; // Initialize campaign count
    }

    function createCampaign(string calldata _title, string calldata _description, uint256 _fundingGoal) external {
        require(_fundingGoal > 0, "Funding goal must be greater than zero");
        
        campaigns[campaignCount] = Campaign({
            creator: msg.sender,
            title: _title,
            description: _description,
            fundingGoal: _fundingGoal,
            totalDonationsTRX: 0,
            totalDonationsUSD: 0,
            funded: false,
            frozen: false
        });

        emit CampaignCreated(campaignCount, msg.sender, _title, _description, _fundingGoal);
        campaignCount++;
    }

    function donateWithTRX(uint256 campaignId) public payable notFrozen(campaignId) {
        require(msg.value > 0, "Must donate a positive amount of TRX");

        Campaign storage campaign = campaigns[campaignId];

        campaign.totalDonationsTRX += msg.value;

        uint256 totalDonationInUSD = convertTRXToUSD(msg.value);
        campaign.totalDonationsUSD += totalDonationInUSD;

        if (campaign.totalDonationsUSD >= campaign.fundingGoal) {
            campaign.funded = true;
            emit CampaignFunded(campaignId);
        }

        emit DonationReceived(campaignId, msg.sender, msg.value, true);
    }

    function convertTRXToUSD(uint256 amountInTRX) internal view returns (uint256) {
        require(priceFeed.latestTimestamp() > 0, "Price data not available");

        int256 usdtPriceInUSD = priceFeed.latestAnswer();
        require(usdtPriceInUSD > 0, "Invalid price data");

        uint256 price = uint256(usdtPriceInUSD);
        return (amountInTRX * price) / (10 ** 6); // Assuming the oracle returns price with 6 decimals
    }

    function freezeCampaign(uint256 campaignId) external {
        Campaign storage campaign = campaigns[campaignId];
        require(msg.sender == campaign.creator, "Only the creator can freeze the campaign");
        campaign.frozen = true;
    }
}
