// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Betting {
    // Owner
    address public owner;

    // -------------------------------
    // Matches
    uint public matchId;

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
    // Players
    mapping(address => Player) public players;

    struct Player {
        uint id;
        string name;
        uint balance;
        uint[] bidHistory;
    }

    // -------------------------------

    event MatchCreated(uint indexed matchId, string teamA, string teamB);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createMatch(string memory _teamA, string memory _teamB) public onlyOwner {
        matchId++;
        matches[matchId] = Match(matchId, _teamA, _teamB, 0, 0, 0, Status.Bets, Exodus.NotFinished);
        emit MatchCreated(matchId, _teamA, _teamB);
    }
}