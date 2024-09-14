import React from "react";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../networkConfig";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useQuizStore } from "../store/store";

export const EndGame = ({ onCreated }: { onCreated: (id: string) => void }) => {
  const { score } = useQuizStore();

  const points = score * 2;

  const counterPackageId = useNetworkVariable("counterPackageId");
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          // Raw effects are required so the effects can be reported back to the wallet
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

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={() => {
          End();
        }}
      >
        End Game
      </button>
    </div>
  );

  function End() {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [tx.object(gameId!), tx.pure.u64(points)],
      target: `${counterPackageId}::counter::end_game`,
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
          }
          refetch();
        },
      },
    );
  }
};
