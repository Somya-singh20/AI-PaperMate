import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6 shadow-lg"
      >
        <FileText className="w-10 h-10 text-white" />
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-5xl md:text-6xl font-bold mb-4"
      >
        <span className="gradient-text">AI PaperMate</span>
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xl text-muted-foreground flex items-center justify-center gap-2"
      >
        <Sparkles className="w-5 h-5 text-accent" />
        Summarize Smarter. Cite Faster.
      </motion.p>
    </motion.div>
  );
};

export default Hero;
