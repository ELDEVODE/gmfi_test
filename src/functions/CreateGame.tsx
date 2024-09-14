import React from "react";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../networkConfig";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useQuizStore } from "../store/store"; // Import the Zustand store

export const CreateGame = ({
  onCreated,
}: {
  onCreated: (id: string) => void;
}) => {
  const counterPackageId = useNetworkVariable("counterPackageId");
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showEffects: true,
        },
      }),
  });

  const [gameId, setGame] = React.useState(() => {
    const hash = window.location.hash.slice(1);
    console.log(hash);
    return isValidSuiObjectId(hash) ? hash : null;
  });

  const { refetch } = useSuiClientQuery("getObject", {
    id: gameId || "",
    options: {
      showContent: true,
      showOwner: true,
    },
  });

  // Import the Zustand store to use the resetQuiz function
  const { resetQuiz } = useQuizStore();

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={() => {
          create();
        }}
      >
        Create Game
      </button>
    </div>
  );

  function create() {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [],
      target: `${counterPackageId}::counter::create`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          const objectId = result.effects?.created?.[0]?.reference?.objectId;
          if (objectId) {
            onCreated(objectId);
            resetQuiz(); // Reset the quiz when a new game is created
          }
          refetch();
        },
      },
    );
  }
};
