import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface OptionsPanelProps {
  summaryStyle: string;
  onSummaryStyleChange: (value: string) => void;
  citationFormat: string;
  onCitationFormatChange: (value: string) => void;
}

const OptionsPanel = ({
  summaryStyle,
  onSummaryStyleChange,
  citationFormat,
  onCitationFormatChange,
}: OptionsPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">Summary Style</label>
        <Select value={summaryStyle} onValueChange={onSummaryStyleChange}>
          <SelectTrigger className="glass-input rounded-xl h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short">Short</SelectItem>
            <SelectItem value="detailed">Detailed</SelectItem>
            <SelectItem value="comprehensive">Comprehensive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Citation Format</label>
        <Select value={citationFormat} onValueChange={onCitationFormatChange}>
          <SelectTrigger className="glass-input rounded-xl h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apa">APA</SelectItem>
            <SelectItem value="ieee">IEEE</SelectItem>
            <SelectItem value="mla">MLA</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};

export default OptionsPanel;
