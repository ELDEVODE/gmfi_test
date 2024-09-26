// import React from "react";
// import { Link, To, useNavigate } from "react-router-dom";
// import { Navbar } from "../components/Navbar";
// import { motion } from "framer-motion";
// import logo from "../images/gmfi.jpg";
// import { useSuiClientQuery } from "@mysten/dapp-kit";
// import { isValidSuiObjectId } from "@mysten/sui/utils";
// import { Transaction } from "@mysten/sui/transactions"; // Import transaction
// import { useNetworkVariable } from "../networkConfig";
// import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
// import { DEVNET_COUNTER_PACKAGE_ID, PLAYER_STATS_ID } from "../constants";
// import { useCurrentAccount } from "@mysten/dapp-kit";

// export function Home() {
//   const navigate = useNavigate(); // Use to programmatically navigate routes
//   const [gameId, setGameId] = React.useState(() => {
//     const hash = window.location.hash.slice(1);
//     return isValidSuiObjectId(hash) ? hash : null;
//   });
//   const playerStatsId = PLAYER_STATS_ID;
//   const counterPackageId = useNetworkVariable("counterPackageId");
//   const currentAccount = useCurrentAccount();
//   const { data, refetch } = useSuiClientQuery("getObject", {
//     id: gameId || "",
//     options: {
//       showContent: true,
//       showOwner: true,
//     },
//   });

//   const suiClient = useSuiClient();
//   const { mutate: signAndExecute } = useSignAndExecuteTransaction({
//     execute: async ({ bytes, signature }) =>
//       await suiClient.executeTransactionBlock({
//         transactionBlock: bytes,
//         signature,
//         options: {
//           showRawEffects: true,
//           showEffects: true,
//         },
//       }),
//   });

//   const address = currentAccount?.address;

//   // Function to start a new session if data is undefined
//   const startSession = async () => {
//     try {
//       const tx = new Transaction();
//       tx.moveCall({
//         arguments: [tx.object(playerStatsId!), tx.pure.address(address!)],
//         target: `${counterPackageId}::counter::emit_player_state`,
//       });
//       // Optionally set gas budget
//       // tx.setGasBudget(10000000);

//       signAndExecute(
//         {
//           transaction: tx,
//         },
//         {
//           onSuccess: (result) => {
//             const createdObject = result.effects?.created?.[0];
//             if (createdObject) {
//               const objectId = createdObject.reference.objectId;
//               setGameId(objectId);
//             }
//             console.log(result);
//             refetch();
//           },
//           onError: (error) => {
//             console.error("Error creating game:", error);
//             refetch();
//           },
//         },
//       );
//     } catch (error) {
//       console.error("Error creating game:", error);
//       return null;
//     }
//   };

//   // Handler to check if session exists or start a new one before routing
//   const handleGameModeNavigation = async (route: To) => {
//     // Check if data exists
//     if (data) {
//       // If session data exists, navigate directly
//       navigate(route);
//     } else {
//       // If session data doesn't exist, create a new session
//       const newGameId = await startSession();
//       if (newGameId) {
//         navigate(route); // Navigate to the selected route after session starts
//       } else {
//         console.error("Failed to start game session.");
//       }
//     }
//   };

//   // Animation variants for hero-content, heading, and buttons
//   const containerVariants = {
//     hidden: { opacity: 0, y: -50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.8, ease: "easeInOut" },
//     },
//   };

//   const buttonVariants = {
//     hover: { scale: 1.1, transition: { duration: 0.3 } },
//     tap: { scale: 0.9 },
//   };

//   return (
//     <div className="fg">
//       <Navbar />
//       <div className="flex justify-center flex-col items-center">
//         {console.log(address)}
//         <div className="hero bg-base-200 min-h-screen">
//           <motion.div
//             className="hero-content text-center"
//             initial="hidden"
//             whileInView="visible"
//             variants={containerVariants}
//           >
//             <motion.div className="max-w-md flex flex-col justify-center items-center">
//               <motion.h1
//                 className="text-5xl font-bold"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 1, ease: "easeOut" }}
//               >
//                 <img
//                   src={logo}
//                   width={120}
//                   className="rounded-2xl p-2 glass"
//                   alt="Game Logo"
//                 />
//               </motion.h1>
//               <motion.p
//                 className="py-6"
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 transition={{ delay: 0.5 }}
//               >
//                 Select Game Mode
//               </motion.p>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <motion.button
//                   className="btn btn-primary hover:glass"
//                   variants={buttonVariants}
//                   whileHover="hover"
//                   whileTap="tap"
//                   onClick={() => handleGameModeNavigation("/single-player")}
//                 >
//                   Single Player Mode
//                 </motion.button>
//                 <motion.button
//                   className="btn btn-secondary hover:glass"
//                   variants={buttonVariants}
//                   whileHover="hover"
//                   whileTap="tap"
//                   onClick={() =>
//                     handleGameModeNavigation("/multiplayer-points")
//                   }
//                 >
//                   Multiplayer Points
//                 </motion.button>
//                 <motion.button
//                   className="btn btn-accent hover:glass"
//                   variants={buttonVariants}
//                   whileHover="hover"
//                   whileTap="tap"
//                   onClick={() =>
//                     handleGameModeNavigation("/multiplayer-stakes")
//                   }
//                 >
//                   Multiplayer Stakes
//                 </motion.button>
//               </div>
//               <p className="text-xl hover:bg-secondary text-accent-content font-bold my-4 p-4 glass absolute bottom-3 rounded-3xl">
//                 Team Spark ✨
//               </p>
//             </motion.div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }
