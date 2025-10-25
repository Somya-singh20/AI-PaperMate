import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center gap-6"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
        >
          <Loader2 className="w-8 h-8 text-white" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
        />
      </div>
      
      <div className="text-center space-y-2">
        <motion.h3
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xl font-semibold flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-accent" />
          Processing your paper...
        </motion.h3>
        <p className="text-muted-foreground">
          Generating summary, extracting keywords, and creating citation
        </p>
      </div>
    </motion.div>
  );
};

export default LoadingSpinner;
