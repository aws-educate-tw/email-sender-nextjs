import { useEffect, useState } from "react";
import IframePreview from "@/app/ui/emailService/iframe-preview";
import { AlertCircle } from "lucide-react";

export default function TemplatePreview({ fileUrl }: { fileUrl: string }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let currentBlobUrl: string | null = null;

    const fetchHtml = async () => {
      setLoading(true);
      setError(null);
      setBlobUrl(null);

      try {
        const res = await fetch(fileUrl);
        if (!res.ok) throw new Error(`Failed to fetch template: ${res.statusText}`);
        const text = await res.text();

        const blob = new Blob([text], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        currentBlobUrl = url;
        setBlobUrl(url);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (fileUrl) fetchHtml();

    return () => {
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }
    };
  }, [fileUrl]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-slate-500">
        <div className="animate-spin h-6 w-6 border-b-2 border-blue-600 rounded-full mb-3" />
        Loading template preview...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-red-500">
        <AlertCircle className="w-6 h-6 mb-2" />
        <p className="text-center">{error}</p>
      </div>
    );
  }

  if (!blobUrl) {
    return (
      <div className="text-center text-slate-400 italic py-8">No template content available.</div>
    );
  }

  return <IframePreview src={blobUrl} title="Email Template Preview" width="100%" height="600px" />;
}
