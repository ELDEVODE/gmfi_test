import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuizStore } from "../store/store";
import { EndGame } from "../functions/EndGame";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Quiz = () => {
  const {
    questions,
    currentQuestionIndex,
    score,
    lives,
    setAnswer,
    nextQuestion,
    resetQuiz,
  } = useQuizStore();
  const [gameOver, setGameOver] = React.useState(false);

  useEffect(() => {
    if (lives === 0 || currentQuestionIndex >= questions.length) {
      setGameOver(true);
    }
  }, [lives, currentQuestionIndex, questions.length]);

  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.answer === answer) {
      toast("Correct answer!", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } else {
      toast.error("Wrong answer!", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
    setAnswer(answer);
    nextQuestion();
  };

  if (gameOver) {
    return (
      <motion.div
        className="glass p-8 bg-secondary text-primary rounded-[30px]"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-4">Game Over</h1>
        <p className="mb-4">Your score: {score}</p>
        {/* <button onClick={resetQuiz} className="btn btn-primary mb-4">
          Restart
        </button> */}
        <EndGame
          onCreated={(id) => {
            window.location.hash = id;
          }}
        />
      </motion.div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <motion.div
      className="glass p-8 bg-secondary text-primary rounded-[30px]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="p-4 bg-primary-content text-primary rounded-3xl capitalize font-bold mb-4"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {currentQuestion?.question}
      </motion.h2>
      <div className="flex flex-col justify-start items-start mt-4">
        {currentQuestion?.options.map((option) => (
          <motion.button
            className="btn btn-secondary my-2 w-full rounded-xl"
            key={option}
            onClick={() => handleAnswer(option)}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {option}
          </motion.button>
        ))}
      </div>
      <div className="mt-4">
        <p className="font-bold">Score: {score}</p>
      </div>
      <div className="mt-4">
        <p className="font-bold">Tries: {lives}</p>
      </div>
    </motion.div>
  );
};
