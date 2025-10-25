import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, File, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

const FileUpload = ({ onFileSelect, selectedFile, onClear }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="w-full"
    >
      {!selectedFile ? (
        <div
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "glass-card rounded-2xl p-12 border-2 border-dashed transition-all duration-300 cursor-pointer hover:shadow-xl",
            isDragging && "border-primary bg-primary/5 scale-[1.02]"
          )}
        >
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={{ y: isDragging ? -10 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
              >
                <Upload className="w-8 h-8 text-white" />
              </motion.div>
              <div className="text-center">
                <p className="text-lg font-semibold mb-1">
                  Drop your PDF here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Upload research papers in PDF format
                </p>
              </div>
            </div>
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card rounded-2xl p-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <File className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="w-10 h-10 rounded-lg hover:bg-destructive/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-destructive" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FileUpload;
