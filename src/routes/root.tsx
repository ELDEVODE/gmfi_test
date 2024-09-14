import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { motion } from "framer-motion";
import logo from "../images/gmfi.jpg";

export function Home() {
  // Animation variants for hero-content, heading, and buttons
  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.3 } },
    tap: { scale: 0.9 },
  };

  return (
    <div className="fg">
      <Navbar />
      <div className="flex justify-center flex-col items-center">
        <div className="hero bg-base-200 min-h-screen">
          <motion.div
            className="hero-content text-center"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
          >
            <motion.div className="max-w-md flex flex-col justify-center items-center">
              <motion.h1
                className="text-5xl font-bold"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <img
                  src={logo}
                  width={120}
                  className="rounded-2xl p-2 glass"
                  alt=""
                />
              </motion.h1>
              <motion.p
                className="py-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Select Game Mode
              </motion.p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/single-player">
                  <motion.button
                    className="btn btn-primary hover:glass"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Single Player Mode
                  </motion.button>
                </Link>
                <Link to="/multiplayer-points">
                  <motion.button
                    className="btn btn-secondary hover:glass"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Multiplayer Points
                  </motion.button>
                </Link>
                <Link to="/multiplayer-stakes">
                  <motion.button
                    className="btn btn-accent hover:glass"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Multiplayer Stakes
                  </motion.button>
                </Link>
              </div>
              <p className="text-xl hover:bg-secondary text-accent-content font-bold my-4 p-4 glass absolute bottom-3 rounded-3xl">
                Team Spark ✨
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
