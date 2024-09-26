import { create } from 'zustand';

interface QuizState {
    questions: { question: string, options: string[], answer: string }[];
    currentQuestionIndex: number;
    score: number;
    lives: number;
    inGame: boolean;
    setAnswer: (answer: string) => void;
    nextQuestion: () => void;
    resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
    questions: [
        {
            question: "What is Sui?",
            options: ["Blockchain", "Cryptocurrency", "Programming Language", "Web Framework"],
            answer: "Blockchain"
        },
        {
            question: "What consensus mechanism does Sui use?",
            options: ["Proof of Stake", "Proof of Work", "Delegated Proof of Stake", "Byzantine Fault Tolerance"],
            answer: "Proof of Stake"
        },
        {
            question: "What programming language is used for smart contracts on Sui?",
            options: ["Move", "Solidity", "Rust", "Python"],
            answer: "Move"
        },
        {
            question: "Who developed the Sui blockchain?",
            options: ["Mysten Labs", "Ethereum Foundation", "Binance Labs", "Google"],
            answer: "Mysten Labs"
        },
        {
            question: "What is the native cryptocurrency of the Sui blockchain?",
            options: ["SUI", "ETH", "BTC", "SOL"],
            answer: "SUI"
        },
        {
            question: "What is the primary purpose of the Sui blockchain?",
            options: ["Decentralized Finance", "Gaming", "Digital Asset Creation", "All of the above"],
            answer: "All of the above"
        },
        {
            question: "Sui leverages the Move programming language, which was originally developed for?",
            options: ["Libra Blockchain", "Solana", "Polkadot", "Ethereum"],
            answer: "Libra Blockchain"
        },
        {
            question: "What is the main scalability feature of Sui?",
            options: ["Parallel Execution", "Sharding", "Layer 2 Solutions", "Sidechains"],
            answer: "Parallel Execution"
        },
        {
            question: "What is the role of validators in Sui?",
            options: ["Process Transactions", "Verify Transactions", "Create Blocks", "All of the above"],
            answer: "All of the above"
        },
        {
            question: "Sui uses a unique data structure for transactions, what is it called?",
            options: ["Objects", "Merkle Trees", "Blocks", "Graphs"],
            answer: "Objects"
        },
        {
            question: "What is Sui’s solution for storing and handling data?",
            options: ["Object-centric Model", "Shard Chains", "Block Tree", "Tokenized Data"],
            answer: "Object-centric Model"
        },
        {
            question: "In Sui, Move is a key component. What is Move?",
            options: ["Smart Contract Language", "Consensus Mechanism", "Wallet", "Execution Engine"],
            answer: "Smart Contract Language"
        },
        {
            question: "How are assets like tokens represented on Sui?",
            options: ["As Objects", "As Contracts", "As Files", "As Blocks"],
            answer: "As Objects"
        },
        {
            question: "What makes Sui’s execution of transactions different?",
            options: ["Parallel Execution", "Layer 2 Scaling", "Optimistic Rollups", "Sidechains"],
            answer: "Parallel Execution"
        },
        {
            question: "Which of the following is a feature of Sui?",
            options: ["Low Latency", "High Throughput", "Scalability", "All of the above"],
            answer: "All of the above"
        },
        {
            question: "What consensus algorithm does Sui use for finality?",
            options: ["Narwhal & Tusk", "Proof of Stake", "Tendermint", "Raft"],
            answer: "Narwhal & Tusk"
        },
        {
            question: "Which of the following use cases is NOT common on Sui?",
            options: ["Artificial Intelligence", "DeFi", "NFTs", "Gaming"],
            answer: "Artificial Intelligence"
        },
        {
            question: "How does Sui achieve parallel transaction processing?",
            options: ["By isolating non-interacting transactions", "By sharding", "By using sidechains", "By creating mini-blockchains"],
            answer: "By isolating non-interacting transactions"
        },
        {
            question: "What is the primary benefit of Sui’s object-based data model?",
            options: ["Optimized for scalability", "Better privacy", "Faster smart contracts", "Reduced storage costs"],
            answer: "Optimized for scalability"
        },
        {
            question: "What year was the Sui blockchain announced?",
            options: ["2021", "2020", "2019", "2022"],
            answer: "2021"
        }
    ],
    currentQuestionIndex: 0,
    score: 0,
    lives: 3,
    inGame: true,
    setAnswer: (answer) => set((state) => {
        const currentQuestion = state.questions[state.currentQuestionIndex];
        if (currentQuestion.answer === answer) {
            return { score: state.score + 1 };
        } else {
            return { lives: state.lives - 1 };
        }
    }),
    nextQuestion: () => set((state) => ({
        currentQuestionIndex: state.currentQuestionIndex + 1
    })),
    resetQuiz: () => set({
        currentQuestionIndex: 0,
        score: 0,
        lives: 3,
        inGame: true,
    })
}));
