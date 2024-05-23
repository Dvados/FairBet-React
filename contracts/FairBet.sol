// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Betting {
    // Owner
    address public owner;

    // -------------------------------
    // Matches
    uint public matchCount;

    mapping(uint => Match) public matches;

    enum Status { Bets, Live, Finished }

    enum Exodus { NotFinished, TeamA, Draw, TeamB }

    struct Match {
        uint id;
        string teamA;
        string teamB;
        uint betAmountTeamA;
        uint betAmountDraw;
        uint betAmountTeamB;
        Status matchStatus;
        Exodus matchResult;
    }

    // -------------------------------
    // Users
    uint public userCount;

    mapping(address => User) public users;

    struct User {
        uint id;
        string name;
        uint balance;
        //uint[] bidHistory;
    }

    // -------------------------------

    event MatchCreated(uint indexed matchId, string teamA, string teamB);
    event UserCreated(address indexed userAddress, uint userId, string name);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createMatch(string memory _teamA, string memory _teamB) public onlyOwner {
        matchCount++;
        matches[matchCount] = Match(matchCount, _teamA, _teamB, 0, 0, 0, Status.Bets, Exodus.NotFinished);
        emit MatchCreated(matchCount, _teamA, _teamB);
    }

    function createProfile(string memory _name) public {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(users[msg.sender].id == 0, "User already exists");

        userCount++;
        users[msg.sender] = User(userCount, _name, 0);
        emit UserCreated(msg.sender, userCount, _name);
    }

}