// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/// This module implements a simple single-player trivia game.
module counter::counter {
    use sui::event;

    /// A shared trivia game object.
    public struct TriviaGame has key {
        id: UID,
        lives: u8,
        points: u64,
        inGame: bool,
    }

  /// Event emitted when a player ends the game.
    public struct GameEnded has copy, drop {
        player: address,
        points_earned: u64,
    }

    // Error codes
    const E_NO_LIVES: u64 = 1;
    const E_GAME_NOT_ACTIVE: u64 = 2;

    /// Create and share a TriviaGame object.
    public fun create(ctx: &mut TxContext) {
        let game = TriviaGame {
            id: object::new(ctx),
            lives: 3,
            points: 0,
            inGame: true,
        };
        transfer::share_object(game);
    }

       /// End the game by providing the total points earned.
    /// This reduces the lives and updates the points in the game.
    public fun end_game(game: &mut TriviaGame, total_points: u64, ctx: &TxContext) {
        assert!(game.lives > 0, E_NO_LIVES);

        // Update points based on the total points earned
        game.points = total_points;

        // Reduce one life
        game.lives = game.lives - 1;

        // Mark the game as ended
        game.inGame = false;

        // Emit the GameEnded event
        event::emit(GameEnded {
            player: tx_context::sender(ctx),
            points_earned: total_points,
        });
    }


    /// Reset the game (can be called by anyone when lives are zero).
    public fun reset_game(game: &mut TriviaGame) {
        assert!(game.lives == 0, E_NO_LIVES);
        game.lives = 3;
    }

    /// Get the current number of lives.
    public fun get_lives(game: &TriviaGame): u8 {
        game.lives
    }

    /// Get the current points.
    public fun get_points(game: &TriviaGame): u64 {
        game.points
    }
}

/*
// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/// This example demonstrates a basic use of a shared object.
/// Rules:
/// - anyone can create and share a counter
/// - everyone can increment a counter by 1
/// - the owner of the counter can reset it to any value
module counter::counter {
  /// A shared counter.
  public struct Counter has key {
    id: UID,
    owner: address,
    value: u64
  }

  /// Create and share a Counter object.
  public fun create(ctx: &mut TxContext) {
    transfer::share_object(Counter {
      id: object::new(ctx),
      owner: ctx.sender(),
      value: 0
    })
  }

  /// Increment a counter by 1.
  public fun increment(counter: &mut Counter) {
    counter.value = counter.value + 1;
  }

  /// Set value (only runnable by the Counter owner)
  public fun set_value(counter: &mut Counter, value: u64, ctx: &TxContext) {
    assert!(counter.owner == ctx.sender(), 0);
    counter.value = value;
  }
}

*/