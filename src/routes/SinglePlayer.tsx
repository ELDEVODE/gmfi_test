import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { CreateGame } from "../functions/CreateGame";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { Quiz } from "../components/Quiz";
import { SuiObjectResponse } from "@mysten/sui/client";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

interface GameState {
  data: any; // Replace 'any' with the actual type of 'data' if known
}

export function SinglePlayer() {
  const currentAccount = useCurrentAccount();
  const gameId = window.location.hash.slice(1);
  const [showInstructions, setShowInstructions] = useState(true);

  // Query the game object using SuiClientQuery
  const { refetch, data, error, isFetching } = useSuiClientQuery("getObject", {
    id: gameId || "",
    options: {
      showContent: true,
      showOwner: true,
    },
  });

  // Extract points, lives, and inGame status from the data
  const fields =
    data && data.data
      ? getCounterFields(data.data as ExtendedSuiObjectResponse)
      : null;
  const points = fields?.points || "N/A";
  const lives = fields?.lives || "N/A";
  const inGame = fields?.inGame || false;

  // Debugging: Log the full data object to inspect its structure
  console.log("Sui Object Data:", data);

  return (
    <div className="fg">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <Navbar />
      <div className="flex justify-between p-2 bg-base-200 rounded-b-2xl">
        <div>
          <strong>Points: {points}</strong>
        </div>
        <div>
          <strong>Lives: {lives}</strong>
        </div>
      </div>
      <motion.div
        className="p-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {showInstructions ? (
          <motion.div
            className="bg-primary glass p-4 rounded-lg shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-2">
              Welcome to the Quiz Game!
            </h2>
            <p className="mb-4 text-2xl">
              Test your knowledge with our exciting quiz game. Answer questions
              to earn points and try to keep your lives from reaching zero.
              <br />
              <br />
              <div className="font-bold mb-3"> Instructions:</div>
              <ul className="list-disc list-inside mb-4 mt-4">
                <li>Click on the answer options to submit your choice.</li>
                <li>
                  You have a limited number of lives. Incorrect answers will
                  reduce your lives.
                </li>
                <li>Your score will increase with correct answers.</li>
                <li>
                  When you run out of lives or complete all questions, the game
                  will end.
                </li>
              </ul>
              Ready to start? Click the "Create Game" button below to begin.
            </p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => setShowInstructions(false)}
            >
              Start Game
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {currentAccount ? (
              inGame ? (
                <Quiz /> // Load Quiz when game starts
              ) : (
                <CreateGame
                  onCreated={(id) => {
                    window.location.hash = id;
                  }}
                />
              )
            ) : (
              <h2 className="text-xl">Please connect your wallet</h2>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// Extend SuiObjectResponse to match the structure of the expected data
interface ExtendedSuiObjectResponse extends SuiObjectResponse {
  content?: {
    dataType: string;
    fields: {
      points: number;
      lives: number;
      inGame: boolean;
    };
  };
}

// Extract fields from the SuiObjectResponse
function getCounterFields(data: ExtendedSuiObjectResponse) {
  if (!data.content || data.content.dataType !== "moveObject") {
    return null;
  }

  return data.content.fields;
}
