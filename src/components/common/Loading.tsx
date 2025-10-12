import { Loader2 } from "lucide-react";

interface LoadingProps {
  text?: string;
}

export const Loading = ({ text = "Loading..." }: LoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
};
