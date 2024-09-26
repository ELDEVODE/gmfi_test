// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/// This module implements a single-player trivia game with persistent player stats and game state,
/// similar to Candy Crush where lives reduce as you play but points accumulate across sessions.
module counter::counter {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::table::{Self, Table};

    /// A shared trivia game object with persistent state.
    public struct TriviaGame has key {
        id: UID,
        total_lives: u8,
        current_lives: u8,
        total_points: u64,
        in_session: bool,
    }

    /// Persistent storage for all players' stats
    public struct PlayerStats has key {
        id: UID,
        stats: Table<address, PlayerRecord>
    }

    /// Individual player's record
    public struct PlayerRecord has copy, store {
        total_points: u64,
        games_played: u64,
        high_score: u64,
        current_lives: u8,
        total_lives: u8,
        in_session: bool
    }

    /// Event emitted when a new game is created or resumed.
    public struct GameStarted has copy, drop {
        player: address,
        current_lives: u8,
        total_points: u64,
    }

    /// Event emitted when a player ends a game session.
    public struct GameSessionEnded has copy, drop {
        player: address,
        points_earned: u64,
        total_points: u64,
        lives_remaining: u8,
    }

    /// Event to emit the player's state
    public struct PlayerStateEmitted has copy, drop {
        player: address,
        total_points: u64,
        games_played: u64,
        high_score: u64,
        current_lives: u8,
        total_lives: u8,
        in_session: bool
    }

    // Error codes
    const E_NO_LIVES: u64 = 1;
    const E_SESSION_NOT_ACTIVE: u64 = 2;

    /// Create and share a TriviaGame object, initialize or update PlayerStats, and start the game.
    public fun create(stats: &mut PlayerStats, ctx: &mut TxContext) {
        let player = tx_context::sender(ctx);
        let (total_points, mut current_lives, games_played, high_score) = if (table::contains(&stats.stats, player)) {
            let player_record = table::borrow(&stats.stats, player);
            (player_record.total_points, player_record.current_lives, player_record.games_played, player_record.high_score)
        } else {
            (0, 3, 0, 0)
        };

        // Ensure we have lives to play
        if (current_lives == 0) {
            current_lives = 3; // Reset lives if they're depleted
        };

        let game = TriviaGame {
            id: object::new(ctx),
            total_lives: 3,
            current_lives,
            total_points,
            in_session: true, // Always start in session
        };

        if (!table::contains(&stats.stats, player)) {
            table::add(&mut stats.stats, player, PlayerRecord {
                total_points,
                games_played,
                high_score,
                current_lives,
                total_lives: 3,
                in_session: true
            });
        } else {
            let player_record = table::borrow_mut(&mut stats.stats, player);
            player_record.current_lives = current_lives;
            player_record.in_session = true;
            player_record.games_played = games_played + 1; // Increment games played
        };

        // Emit the GameStarted event
        event::emit(GameStarted { 
            player,
            current_lives,
            total_points
        });

        transfer::share_object(game);
    }

    /// End the current game session.
    public fun end_session(game: &mut TriviaGame, stats: &mut PlayerStats, session_points: u64, ctx: &TxContext) {
        assert!(game.in_session, E_SESSION_NOT_ACTIVE);

        // Update game state
        game.total_points = game.total_points + session_points;
        game.current_lives = game.current_lives - 1;
        game.in_session = false;

        // Update player stats
        let player = tx_context::sender(ctx);
        let player_record = table::borrow_mut(&mut stats.stats, player);
        player_record.total_points = player_record.total_points + session_points;
        player_record.current_lives = game.current_lives;
        player_record.in_session = false;
        if (session_points > player_record.high_score) {
            player_record.high_score = session_points;
        };

        // Emit the GameSessionEnded event
        event::emit(GameSessionEnded {
            player,
            points_earned: session_points,
            total_points: game.total_points,
            lives_remaining: game.current_lives,
        });
    }

    /// Add points to the current session.
    public fun add_points(game: &mut TriviaGame, points: u64) {
        assert!(game.in_session, E_SESSION_NOT_ACTIVE);
        game.total_points = game.total_points + points;
    }

    /// Reset the game (can be called by anyone when lives are zero).
    public fun reset_game(game: &mut TriviaGame, stats: &mut PlayerStats, ctx: &TxContext) {
        assert!(game.current_lives == 0, E_NO_LIVES);
        game.current_lives = game.total_lives;
        game.in_session = true;

        // Reset player record
        let player = tx_context::sender(ctx);
        let player_record = table::borrow_mut(&mut stats.stats, player);
        player_record.current_lives = game.total_lives;
        player_record.in_session = true;
        player_record.games_played = player_record.games_played + 1;
    }

    /// Get the current number of lives.
    public fun get_lives(game: &TriviaGame): u8 {
        game.current_lives
    }

    /// Get the total points accumulated across all sessions.
    public fun get_total_points(game: &TriviaGame): u64 {
        game.total_points
    }

    /// Get player's total points across all games.
    public fun get_player_total_points(stats: &PlayerStats, player: address): u64 {
        let player_record = table::borrow(&stats.stats, player);
        player_record.total_points
    }

    /// Get player's total games played.
    public fun get_games_played(stats: &PlayerStats, player: address): u64 {
        let player_record = table::borrow(&stats.stats, player);
        player_record.games_played
    }

    /// Get player's high score.
    public fun get_high_score(stats: &PlayerStats, player: address): u64 {
        let player_record = table::borrow(&stats.stats, player);
        player_record.high_score
    }

    /// Get player's data
    public fun get_player_data(stats: &PlayerStats, player: address): PlayerRecord {
        *table::borrow(&stats.stats, player)
    }

    /// Emit the current state for a given player
    public fun emit_player_state(stats: &PlayerStats, player: address) {
        let player_record = table::borrow(&stats.stats, player);
        
        event::emit(PlayerStateEmitted {
            player,
            total_points: player_record.total_points,
            games_played: player_record.games_played,
            high_score: player_record.high_score,
            current_lives: player_record.current_lives,
            total_lives: player_record.total_lives,
            in_session: player_record.in_session
        });
    }

    /// Initialize the PlayerStats (should be called once at module initialization)
    fun init(ctx: &mut TxContext) {
        let stats = PlayerStats {
            id: object::new(ctx),
            stats: table::new(ctx)
        };
        transfer::share_object(stats);
    }
}