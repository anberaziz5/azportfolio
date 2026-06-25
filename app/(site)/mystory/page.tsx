"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function MyStoryPage() {
  const [activeTab, setActiveTab] = useState("life");
  const [storyData, setStoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStory() {
      setLoading(true);
      try {
        const res = await fetch(`/api/stories?category=${activeTab}`);
        const result = await res.json();
        if (result.success && result.data) {
          setStoryData(result.data);
        } else {
          setStoryData(null);
        }
      } catch (error) {
        console.error("Error loading transmission data:", error);
        setStoryData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchStory();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-transparent text-foreground pt-32 pb-24 max-w-4xl mx-auto px-6">
      {/* Tab Switcher Controls */}
      <div className="flex gap-6 mb-12 border-b border-border/40 pb-4 font-mono text-xs">
        {["life", "education", "research"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`uppercase tracking-wider pb-2 transition-all duration-200 ${
              activeTab === tab 
                ? "text-[#F38020] border-b-2 border-[#F38020] font-bold" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "life" ? "Life Story" : tab === "education" ? "Education" : "Research APPROACH"}
          </button>
        ))}
      </div>

      {/* Main Content Viewport */}
      <div className="bg-card/30 border border-border/50 rounded-2xl p-8 md:p-12 backdrop-blur-md shadow-xl">
        {loading ? (
          <div className="font-mono text-sm text-muted-foreground flex items-center gap-3 animate-pulse">
            <div className="w-4 h-4 border-2 border-[#F38020] border-t-transparent rounded-full animate-spin" />
            SYNCHRONIZING SECURE CHANNELS...
          </div>
        ) : storyData ? (
          <article className="prose prose-invert max-w-none text-base leading-relaxed space-y-6">
            <ReactMarkdown 
              components={{
                h1: ({...props}) => <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-6" {...props} />,
                h2: ({...props}) => <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#F38020] mt-10 mb-4 flex items-center gap-2" {...props} />,
                h3: ({...props}) => <h3 className="text-lg font-bold tracking-tight text-foreground mt-6 mb-2" {...props} />,
                p: ({...props}) => <p className="text-muted-foreground/90 text-balance" {...props} />,
                strong: ({...props}) => <strong className="text-foreground font-semibold text-[#F38020]" {...props} />,
                ul: ({...props}) => <ul className="list-disc pl-6 space-y-2 text-muted-foreground/90" {...props} />,
                li: ({...props}) => <li className="marker:text-[#F38020]" {...props} />,
              }}
            >
              {storyData.content}
            </ReactMarkdown>
          </article>
        ) : (
          <div className="font-mono text-sm text-muted-foreground/70">
            No active records found in database collection for this query category. Make sure to seed your records into MongoDB!
          </div>
        )}
      </div>
    </div>
  );
}