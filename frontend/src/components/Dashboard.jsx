import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Copy,
  Sparkles,
  MessageSquare,
  Send,
  HelpCircle,
  ExternalLink,
  Check
} from "lucide-react";

export default function Dashboard({ data, filename }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedClause, setExpandedClause] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [copiedFixId, setCopiedFixId] = useState(null);

  // AI Chat Assistant States
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: `Hello! I have analyzed "${filename}". I found ${data.stats.risky} high-risk clauses and ${data.stats.caution} cautions. Ask me anything about this document!`,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Pre-configured FAQ questions depending on document type
  const contractFaqs = {
    "Rent Agreement": [
      "Can I break this lease early?",
      "How much is the rent increase?",
      "When can the landlord enter?"
    ],
    "Employment Contract": [
      "Can I work on side projects?",
      "Is the non-compete enforceable?",
      "What happens if I leave within a year?"
    ],
    "SaaS Terms of Service": [
      "How much liability does the provider have?",
      "Can they use my data for marketing?",
      "Is there a service uptime warranty?"
    ]
  };

  const handleCopy = (id, text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "simplified") {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      setCopiedFixId(id);
      setTimeout(() => setCopiedFixId(null), 2000);
    }
  };

  const toggleClause = (id) => {
    if (expandedClause === id) {
      setExpandedClause(null);
    } else {
      setExpandedClause(id);
    }
  };

  // Filter clauses based on Search Query and Active Filter tab
  const filteredClauses = data.clauses.filter((clause) => {
    const matchesFilter = activeFilter === "all" || clause.status === activeFilter;
    const matchesSearch =
      clause.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.original.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.simplified.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-500 stroke-emerald-500";
    if (score >= 60) return "text-amber-500 stroke-amber-500";
    return "text-red-500 stroke-red-500";
  };

  const handleSendMessage = (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = { sender: "user", text: messageText };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiText = "I see. Let me look at the contract clauses details.";
      const query = messageText.toLowerCase();

      // Simple keyword matching for customized mock responses
      if (data.type === "Rent Agreement") {
        if (query.includes("leave") || query.includes("break") || query.includes("terminate") || query.includes("early")) {
          aiText = "According to Clause 3 (Security Deposit Forfeiture), early termination will cause you to forfeit your entire security deposit as liquidated damages. I recommend renegotiating this to a flat 1-2 month notice fee.";
        } else if (query.includes("increase") || query.includes("rent") || query.includes("escalation") || query.includes("hike")) {
          aiText = "According to Clause 1, there is a automatic 15% rent increase every year upon renewal. This is very high! You should ask to limit this to a maximum of 5% or tie it to the local Consumer Price Index (CPI).";
        } else if (query.includes("enter") || query.includes("landlord") || query.includes("visit")) {
          aiText = "Clause 2 gives the Landlord the right to enter your apartment 'at any time, with or without prior notice.' This is a significant breach of privacy. You should request at least 24 hours advance notice.";
        }
      } else if (data.type === "Employment Contract") {
        if (query.includes("side") || query.includes("project") || query.includes("own") || query.includes("startup")) {
          aiText = "Clause 1 (Intellectual Property Assignment) assigns all inventions made during your employment to the company, even if done off-duty and using your own resources. You should negotiate a carve-out for personal, unrelated projects.";
        } else if (query.includes("compete") || query.includes("leave") || query.includes("another job")) {
          aiText = "Clause 2 has a strict 24-month non-compete covering a 50-mile radius. In many regions, a 2-year non-compete is legally unenforceable or overly restrictive. Try to reduce this to 6 months or remove it.";
        } else if (query.includes("bonus") || query.includes("clawback") || query.includes("refund")) {
          aiText = "Clause 3 requires a 100% refund of your sign-on bonus if you leave within 12 months. It's best to ask for this to be prorated (e.g. you owe 1/12th less for each month completed).";
        }
      } else if (data.type === "SaaS Terms of Service") {
        if (query.includes("liability") || query.includes("sue") || query.includes("breach")) {
          aiText = "Clause 1 caps the provider's liability to the amount you paid them in the preceding 12 months. If their system causes a major data breach, your actual damages could be much higher. Ask for a higher cap (e.g., 2x-3x fees).";
        } else if (query.includes("marketing") || query.includes("data") || query.includes("privacy")) {
          aiText = "Clause 2 grants the provider a license to use your anonymized data for marketing and product training. If you upload highly sensitive documents, you should ask to opt out of marketing usage.";
        }
      }

      setChatMessages((prev) => [...prev, { sender: "ai", text: aiText }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Summary & Analytics (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Document Card */}
          <div className="glass rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/80 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-600/10 rounded-2xl text-indigo-600 dark:text-indigo-400 border border-indigo-200/10">
                <FileText size={22} />
              </div>
              <div className="min-w-0">
                <h2 className="font-outfit font-extrabold text-lg text-slate-800 dark:text-white truncate">
                  {filename}
                </h2>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {data.type}
                </span>
              </div>
            </div>

            {/* Health Score Gauge */}
            <div className="flex flex-col items-center py-4 border-y border-slate-200/50 dark:border-slate-800/50">
              <span className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Contract Trust Score
              </span>
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    className="stroke-slate-200 dark:stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="52"
                    className={getScoreColor(data.healthScore)}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={326}
                    initial={{ strokeDashoffset: 326 }}
                    animate={{ strokeDashoffset: 326 - (326 * data.healthScore) / 100 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="font-outfit font-black text-3xl text-slate-800 dark:text-white">
                    {data.healthScore}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    / 100
                  </span>
                </div>
              </div>
              
              <span className="mt-3 font-inter text-xs text-slate-500 dark:text-slate-400 font-medium">
                {data.healthScore >= 85 ? (
                  <span className="text-emerald-500 font-semibold">High Credibility contract.</span>
                ) : data.healthScore >= 65 ? (
                  <span className="text-amber-500 font-semibold">Standard contract with risks.</span>
                ) : (
                  <span className="text-red-500 font-semibold">Caution: Severe clauses identified.</span>
                )}
              </span>
            </div>

            {/* Clause Breakdown stats */}
            <div className="grid grid-cols-3 gap-2 mt-6">
              <div className="p-3 bg-red-500/5 dark:bg-red-500/10 border border-red-500/10 rounded-2xl text-center">
                <span className="font-outfit font-black text-xl text-red-500 block">
                  {data.stats.risky}
                </span>
                <span className="font-inter text-[10px] text-red-500 font-bold uppercase tracking-wider">
                  Risky
                </span>
              </div>
              <div className="p-3 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 rounded-2xl text-center">
                <span className="font-outfit font-black text-xl text-amber-500 block">
                  {data.stats.caution}
                </span>
                <span className="font-inter text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                  Caution
                </span>
              </div>
              <div className="p-3 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 rounded-2xl text-center">
                <span className="font-outfit font-black text-xl text-emerald-500 block">
                  {data.stats.safe}
                </span>
                <span className="font-inter text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
                  Safe
                </span>
              </div>
            </div>
          </div>

          {/* AI Executive Summary Card */}
          <div className="glass rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/80 shadow-md">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles size={16} className="text-indigo-500 animate-pulse" />
              Executive Summary
            </h3>
            <p className="font-inter text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {data.summary}
            </p>
          </div>
        </div>

        {/* Right Side: Clauses Reviews & Filters (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Filter Tabs */}
            <div className="flex flex-wrap p-1.5 bg-slate-200/60 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/80 rounded-2xl w-full sm:w-auto">
              {[
                { id: "all", label: "All Clauses" },
                { id: "risky", label: "Risky", dot: "bg-red-500" },
                { id: "caution", label: "Caution", dot: "bg-amber-500" },
                { id: "safe", label: "Safe", dot: "bg-emerald-500" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
                    activeFilter === tab.id
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {tab.dot && <span className={`w-2 h-2 rounded-full ${tab.dot}`} />}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search clauses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Clause list */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredClauses.length > 0 ? (
                filteredClauses.map((clause) => {
                  const isExpanded = expandedClause === clause.id;
                  
                  return (
                    <motion.div
                      layout
                      key={clause.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.2 }}
                      className={`glass rounded-3xl border transition-all duration-300 overflow-hidden ${
                        isExpanded
                          ? "border-slate-300 dark:border-slate-700/80 shadow-lg"
                          : "border-slate-200/50 dark:border-slate-800/60 shadow-sm hover:border-slate-300 dark:hover:border-slate-700/50"
                      }`}
                    >
                      {/* Clause Header/Click Area */}
                      <button
                        onClick={() => toggleClause(clause.id)}
                        className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {clause.status === "risky" && (
                            <div className="p-2 bg-red-500/10 text-red-500 rounded-xl border border-red-500/10 animate-border-pulse">
                              <AlertCircle size={18} className="animate-pulse" />
                            </div>
                          )}
                          {clause.status === "caution" && (
                            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/10">
                              <AlertTriangle size={18} />
                            </div>
                          )}
                          {clause.status === "safe" && (
                            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/10">
                              <CheckCircle2 size={18} />
                            </div>
                          )}

                          <div className="min-w-0">
                            <h4 className="font-outfit font-bold text-slate-800 dark:text-slate-200 text-base sm:text-lg truncate pr-2">
                              {clause.title}
                            </h4>
                            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-md ${
                              clause.status === "risky" ? "bg-red-500/10 text-red-500" :
                              clause.status === "caution" ? "bg-amber-500/10 text-amber-500" :
                              "bg-emerald-500/10 text-emerald-500"
                            }`}>
                              {clause.status}
                            </span>
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/40 text-slate-500">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </button>

                      {/* Expandable Clause Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="border-t border-slate-200/50 dark:border-slate-800/50 overflow-hidden"
                          >
                            <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/20">
                              
                              {/* Legalese vs Simplified grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Legalese */}
                                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                                  <span className="font-outfit text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2">
                                    Original Legalese Contract Text
                                  </span>
                                  <p className="font-inter text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-mono">
                                    {clause.original}
                                  </p>
                                </div>

                                {/* Simplified */}
                                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
                                  <div>
                                    <span className="font-outfit text-[11px] font-extrabold text-indigo-500 dark:text-teal-400 uppercase tracking-widest block mb-2">
                                      AI Simplified Translation
                                    </span>
                                    <p className="font-inter text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                                      {clause.simplified}
                                    </p>
                                  </div>
                                  <div className="flex justify-end mt-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                                    <button
                                      onClick={() => handleCopy(clause.id, clause.simplified, "simplified")}
                                      className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
                                    >
                                      {copiedId === clause.id ? (
                                        <>
                                          <Check size={12} className="text-emerald-500" />
                                          Copied!
                                        </>
                                      ) : (
                                        <>
                                          <Copy size={12} />
                                          Copy Translation
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Details Panel */}
                              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                                <span className="font-outfit text-[11px] font-extrabold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest block mb-2">
                                  Why it Matters
                                </span>
                                <p className="font-inter text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                  {clause.explanation}
                                </p>
                              </div>

                              {/* Suggested Renegotiation / Action */}
                              <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="max-w-xl">
                                  <span className="font-outfit text-[11px] font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-widest block mb-1">
                                    Suggested Renegotiation Strategy
                                  </span>
                                  <p className="font-inter text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
                                    {clause.renegotiate}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleCopy(clause.id, clause.renegotiate, "renegotiate")}
                                  className="flex-shrink-0 self-end sm:self-center px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                                >
                                  {copiedFixId === clause.id ? (
                                    <>
                                      <Check size={12} className="text-emerald-500" />
                                      Copied Fix!
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={12} />
                                      Copy Action Text
                                    </>
                                  )}
                                </button>
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              ) : (
                <div className="glass p-12 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 text-center">
                  <p className="font-inter text-slate-500 dark:text-slate-400">
                    No clauses match your search or filter criteria.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Chat Assistant Section */}
          <div className="glass rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/80 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
                <MessageSquare size={18} />
              </div>
              <h3 className="font-outfit font-extrabold text-base text-slate-800 dark:text-white">
                LegalLingo AI Copilot
              </h3>
            </div>

            {/* Chat Board */}
            <div className="h-64 overflow-y-auto bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 space-y-4 mb-4 flex flex-col">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/40 dark:border-slate-700/50 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-2xl rounded-bl-none flex items-center gap-1.5 border border-slate-200/40 dark:border-slate-700/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Preconfigured Suggestions */}
            <div className="mb-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2 flex items-center gap-1">
                <HelpCircle size={10} /> Suggested Questions
              </span>
              <div className="flex flex-wrap gap-2">
                {contractFaqs[data.type]?.map((faq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(faq)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-indigo-500/50 dark:hover:border-teal-500/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {faq}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(chatInput);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask about this agreement..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
