import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Hero from "@/components/Hero";
import FileUpload from "@/components/FileUpload";
import TextInput from "@/components/TextInput";
import OptionsPanel from "@/components/OptionsPanel";
import ResultsDisplay from "@/components/ResultsDisplay";
import LoadingSpinner from "@/components/LoadingSpinner";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [summaryStyle, setSummaryStyle] = useState("detailed");
  const [citationFormat, setCitationFormat] = useState("apa");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    summary: string;
    keywords: string[];
    citation: string;
  } | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!selectedFile && !textInput.trim()) {
      toast({
        title: "No input provided",
        description: "Please upload a PDF or paste text to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResults(null);

    try {
      let content = textInput;
      
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        
        // Read file as text (simplified - in production, use proper PDF parsing)
        const text = await selectedFile.text();
        content = text;
      }

      const { data, error } = await supabase.functions.invoke("summarize-paper", {
        body: {
          content,
          summaryStyle,
          citationFormat,
        },
      });

      if (error) {
        if (error.message.includes("429")) {
          toast({
            title: "Rate limit exceeded",
            description: "Please try again in a moment.",
            variant: "destructive",
          });
        } else if (error.message.includes("402")) {
          toast({
            title: "Credits required",
            description: "Please add credits to continue using AI features.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      setResults(data);
      toast({
        title: "Success!",
        description: "Your paper has been processed successfully.",
      });
    } catch (error) {
      console.error("Error processing paper:", error);
      toast({
        title: "Error",
        description: "Failed to process the paper. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
      
      <div className="relative z-10 container max-w-4xl mx-auto px-4 py-12">
        {/* Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed top-6 right-6 z-50"
        >
          <ThemeToggle />
        </motion.div>

        <Hero />

        <div className="space-y-8">
          <FileUpload
            onFileSelect={setSelectedFile}
            selectedFile={selectedFile}
            onClear={() => setSelectedFile(null)}
          />

          <div className="text-center">
            <p className="text-muted-foreground font-medium">OR</p>
          </div>

          <TextInput value={textInput} onChange={setTextInput} />

          <OptionsPanel
            summaryStyle={summaryStyle}
            onSummaryStyleChange={setSummaryStyle}
            citationFormat={citationFormat}
            onCitationFormatChange={setCitationFormat}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              onClick={handleGenerate}
              disabled={isLoading || (!selectedFile && !textInput.trim())}
              size="lg"
              className="w-full rounded-xl h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Summary & Citation
            </Button>
          </motion.div>

          {isLoading && <LoadingSpinner />}

          {results && !isLoading && (
            <ResultsDisplay
              summary={results.summary}
              keywords={results.keywords}
              citation={results.citation}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
