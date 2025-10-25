import { motion } from "framer-motion";
import { Copy, Check, FileText, Tag, Quote } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface ResultsDisplayProps {
  summary: string;
  keywords: string[];
  citation: string;
}

const ResultsDisplay = ({ summary, keywords, citation }: ResultsDisplayProps) => {
  const [copiedCitation, setCopiedCitation] = useState(false);

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-8 space-y-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Summary</h3>
        </div>
        <p className="text-foreground/90 leading-relaxed">{summary}</p>
      </motion.div>

      {/* Keywords Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-8 space-y-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Tag className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-xl font-semibold">Keywords</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm font-medium rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                {keyword}
              </Badge>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Citation Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-8 space-y-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Quote className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Citation</h3>
          </div>
          <Button
            onClick={handleCopyCitation}
            variant="outline"
            size="sm"
            className="rounded-lg"
          >
            {copiedCitation ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>
        <p className="text-foreground/90 font-mono text-sm bg-muted/50 p-4 rounded-lg">
          {citation}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ResultsDisplay;
