import { motion } from "framer-motion";
import { Textarea } from "./ui/textarea";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TextInput = ({ value, onChange }: TextInputProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="w-full"
    >
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste your research paper text here..."
        className="glass-input min-h-[200px] resize-none rounded-2xl p-6 text-base focus-visible:ring-2 focus-visible:ring-primary transition-all"
      />
    </motion.div>
  );
};

export default TextInput;
