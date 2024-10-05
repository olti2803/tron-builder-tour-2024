// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // Importing ERC20 interface

contract TronCrowdfunding {
    error contractFrozen();
    error fundingGoalNotMet();
    
    IERC20 public usddToken; // USDD token contract

    struct Campaign {
        address creator;
        string title;           // Title of the campaign
        string description;
        uint256 fundingGoal;    // Funding goal in USDD
        uint256 totalDonations;  // Total donations in USDD
        uint256 totalDonationsTRX; // Total donations in TRX
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

    constructor(address _usddToken) {
        usddToken = IERC20(_usddToken);
        campaignCount = 0; // Initialize campaign count
    }

    /**
     * @dev Allows users to create a new crowdfunding campaign
     * @param _title Title of the campaign
     * @param _description Description of the campaign
     * @param _fundingGoal Amount to be raised in USDD
     */
    function createCampaign(string calldata _title, string calldata _description, uint256 _fundingGoal) external {
        require(_fundingGoal > 0, "Funding goal must be greater than zero");
        
        campaigns[campaignCount] = Campaign({
            creator: msg.sender,
            title: _title,
            description: _description,
            fundingGoal: _fundingGoal,
            totalDonations: 0,
            totalDonationsTRX: 0, // Initialize total donations in TRX
            funded: false,
            frozen: false
        });

        emit CampaignCreated(campaignCount, msg.sender, _title, _description, _fundingGoal);
        campaignCount++;
    }

    /**
     * @dev Users can fund a specific campaign with USDD
     * @param campaignId The ID of the campaign to fund
     * @param amount The amount of USDD to donate
     */
    function donateToCampaign(uint256 campaignId, uint256 amount) public notFrozen(campaignId) {
        require(amount > 0, "Must donate a positive amount");

        Campaign storage campaign = campaigns[campaignId];
        
        // Transfer USDD from donor to this contract
        usddToken.transferFrom(msg.sender, address(this), amount);

        // Update campaign total donations
        campaign.totalDonations += amount;

        // Check if the campaign is now funded
        if (campaign.totalDonations >= campaign.fundingGoal) {
            campaign.funded = true;
            emit CampaignFunded(campaignId);
        }

        emit DonationReceived(campaignId, msg.sender, amount, false); // Indicate this was a USDD donation
    }

    /**
     * @dev Users can fund a specific campaign with TRX
     * @param campaignId The ID of the campaign to fund
     */
    function donateWithTRX(uint256 campaignId) public payable notFrozen(campaignId) {
        require(msg.value > 0, "Must donate a positive amount of TRX");

        Campaign storage campaign = campaigns[campaignId];

        // Update campaign total donations in TRX
        campaign.totalDonationsTRX += msg.value;

        // Check if the campaign is now funded
        uint256 totalDonationInUSDD = convertTRXToUSDD(msg.value); // Implement this function to convert TRX to USDD

        campaign.totalDonations += totalDonationInUSDD;

        if (campaign.totalDonations >= campaign.fundingGoal) {
            campaign.funded = true;
            emit CampaignFunded(campaignId);
        }

        emit DonationReceived(campaignId, msg.sender, msg.value, true); // Indicate this was a TRX donation
    }

    /**
     * @dev This function should implement the conversion logic from TRX to USDD.
     * @param amountInTRX Amount in TRX to convert
     * @return Amount in USDD
     */
    function convertTRXToUSDD(uint256 amountInTRX) internal view returns (uint256) {
        // Placeholder for conversion logic.
        // You could use an oracle or price feed to get the current TRX to USDD conversion rate.
        return amountInTRX; // This is a placeholder; actual conversion logic needed
    }

    /**
     * @dev Allows the creator to freeze the campaign if needed
     * @param campaignId The ID of the campaign to freeze
     */
    function freezeCampaign(uint256 campaignId) external {
        Campaign storage campaign = campaigns[campaignId];
        require(msg.sender == campaign.creator, "Only the creator can freeze the campaign");
        campaign.frozen = true;
    }
}
