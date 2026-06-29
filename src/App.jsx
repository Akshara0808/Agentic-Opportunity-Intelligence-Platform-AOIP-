import { useState, useEffect, useRef } from 'react';
import './App.css';

// Dynamic Mock Response Generator for client-side Demo Mode
const generateMockResponse = (industry, trigger) => {
  const trigLower = trigger.toLowerCase();
  
  // Distinct company names based on industry vertical
  let companyPool = ["NovaTech", "AeroSync", "VertexGlobal", "DeltaSystems", "QuantumTech"];
  const indLower = industry.toLowerCase();
  if (indLower.includes("security") || indLower.includes("cyber")) {
    companyPool = ["CloudShield", "Mitigata", "SecuraNet", "ThreatZero", "ApexGuard", "FortressAI", "Vigilante.IO"];
  } else if (indLower.includes("health") || indLower.includes("med")) {
    companyPool = ["MedPulse", "CureFlow", "BioSync", "HealTech", "PathAI", "OmniHealth", "MediGene"];
  } else if (indLower.includes("finance") || indLower.includes("fin") || indLower.includes("pay")) {
    companyPool = ["PayFlo", "LedgerVault", "CoinAlpha", "EquinoxCapital", "StripeX", "BlockTrust", "ApexPay"];
  } else if (indLower.includes("ai") || indLower.includes("saas") || indLower.includes("soft") || indLower.includes("tech")) {
    companyPool = ["BrainWave", "PromptFlow", "AutoAgent", "ScribeAI", "ModelForge", "ChatFlow", "SynapseAI"];
  }

  // Shuffle or slice 4 companies
  const selectedCompanies = companyPool.slice(0, 4);

  // Default stages configuration (all run by default)
  const stages = [
    { name: "News Monitor", status: "complete", role: "Monitors web & market sources", reason: "Monitored RSS feeds for live market events" },
    { name: "Discovery Agent", status: "complete", role: "Identifies ICP-matching companies", reason: "Extracted candidate companies from news headlines" },
    { name: "Validation Agent", status: "complete", role: "Validates & enriches company data", reason: "Cross-referenced matches against ICP stage and size filters" },
    { name: "Research Agent", status: "complete", role: "Deepens company intelligence", reason: "Compiled profile summaries and financial context" },
    { name: "Contact Agent", status: "complete", role: "Identifies decision-makers by persona", reason: "Discovered CTO/CISO contacts matching target roles" },
    { name: "Recommendation Agent", status: "complete", role: "Generates next best actions", reason: "Generated prioritised outreach drafts and prioritisation scores" }
  ];

  // Apply Planner Logic: Skip specific agents depending on Trigger Event
  if (trigLower === "ipo") {
    stages[3].status = "skipped";
    stages[3].reason = "Skipped: Deep startup research is bypassed for public listing events.";
    stages[4].status = "skipped";
    stages[4].reason = "Skipped: Contact discovery paused. Public company outreach is handled via institutional relations.";
    stages[5].status = "skipped";
    stages[5].reason = "Skipped: Outreach recommendations skipped. Listed companies are saved to monitoring logs only.";
  } else if (trigLower === "acquisition") {
    stages[4].status = "skipped";
    stages[4].reason = "Skipped: Contact discovery skipped. M&A announcements trigger immediate leadership reorganization.";
  } else if (trigLower === "hiring") {
    stages[3].status = "skipped";
    stages[3].reason = "Skipped: Deep company profiling bypassed for standard hiring/recruitment tracking.";
    stages[5].status = "skipped";
    stages[5].reason = "Skipped: B2B outreach recommendation bypassed. Recruiter routing activated.";
  }

  const isResearchSkipped = stages[3].status === "skipped";
  const isContactsSkipped = stages[4].status === "skipped";
  const isRecommendationsSkipped = stages[5].status === "skipped";

  const discoveryCompanies = [];
  const validatedCompanies = [];
  const researchResults = [];
  const contactsList = [];
  const recommendationsList = [];

  const firstNames = ["Sarah", "Rajesh", "Vikram", "Amanda", "David", "Neha", "Michael", "Arjun"];
  const lastNames = ["Jenkins", "Kumar", "Mehta", "Smith", "Taylor", "Sharma", "Miller", "Patel"];
  const sources = ["TechCrunch", "Business Standard", "VentureBeat", "Bloomberg", "Reuters"];

  selectedCompanies.forEach((companyName, idx) => {
    // Score calculation
    // Make 4th company fail validation to demonstrate qualified vs. unqualified states
    const isLast = idx === 3;
    const score = isLast ? 62 : (96 - idx * 5);
    const isValid = !isLast;

    let summaryText = "";
    if (trigLower === "funding") {
      summaryText = `${companyName} raises $${isValid ? (12 + idx * 4) : "1.5"}M in fresh funding to scale developer operations and expand market capture in the ${industry} sector.`;
    } else if (trigLower === "ipo") {
      summaryText = `${companyName} registers for IPO listing, targeting a valuation expansion post-market rollout of its ${industry} solutions.`;
    } else if (trigLower === "acquisition") {
      summaryText = `${companyName} acquired for strategic technology assets, integrating key ${industry} features into consolidated corporate units.`;
    } else if (trigLower === "hiring") {
      summaryText = `${companyName} opens key engineering slots to expand teams, following rapid scaling of their core ${industry} platforms.`;
    } else {
      summaryText = `${companyName} announces major geographical expansion, deploying localized sales pipelines for ${industry} platforms.`;
    }

    const companyItem = {
      company: companyName,
      industry: industry,
      trigger: trigger,
      summary: summaryText,
      confidence: 86 + idx * 4,
      source: sources[idx % sources.length],
      url: `https://example.com/${companyName.toLowerCase()}-news`,
      published_at: new Date(Date.now() - idx * 36 * 3600 * 1000).toISOString(),
      validation_score: score,
      is_valid: isValid,
      validation_reason: isValid 
        ? `Excellent opportunity: Strong ${trigger} signal matching target ${industry} ICP employee limits.`
        : `Rejected: Startup team size and capital event stage fall below targeted B2B filters.`
    };

    discoveryCompanies.push(companyItem);
    validatedCompanies.push(companyItem);

    if (!isValid) return;

    if (!isResearchSkipped) {
      researchResults.push({
        name: companyName,
        industry: industry,
        summary: `${companyName} is a high-growth company operating in the ${industry} domain. Their recent news regarding ${trigger} indicates immediate structural changes and budget allocation, making them a premium prospect.`,
        validation_score: score,
        reason: "Qualified: Active capital/market expansion in target region."
      });
    }

    const decMaker = `${firstNames[(idx + 2) % firstNames.length]} ${lastNames[(idx + 3) % lastNames.length]}`;
    const email = `${decMaker.toLowerCase().replace(" ", ".")}@${companyName.toLowerCase().replace(" ", "")}.com`;

    if (!isContactsSkipped) {
      contactsList.push({
        company: companyName,
        decision_maker: decMaker,
        email: email,
        validation_score: score,
        status: score >= 90 ? "High Opportunity" : "Medium Opportunity"
      });
    }

    if (!isRecommendationsSkipped) {
      let recAction = `Schedule product demo focusing on security integration. Pitch scalability features to ${companyName}.`;
      if (trigLower === "hiring") {
        recAction = `Reach out regarding scaling support; offer architecture review packages matching their talent surge.`;
      } else if (trigLower === "expansion") {
        recAction = `Connect with localized compliance documentation and regional data residency blueprints.`;
      }
      
      recommendationsList.push({
        company: companyName,
        priority: score >= 90 ? "Critical" : "High",
        recommended_action: recAction,
        decision_maker: decMaker,
        email: email,
        validation_score: score,
        why: `${companyName} displayed a strong buying signal via a recent ${trigger} announcement. Fit score: ${score}/100.`
      });
    }
  });

  return {
    request: { industry, trigger },
    discovery: { companies: discoveryCompanies },
    validation: { validated_companies: validatedCompanies },
    research: { research_results: researchResults },
    contacts: { contacts: contactsList },
    recommendation: { recommendations: recommendationsList },
    orchestration: { stages }
  };
};

const defaultStages = [
  { name: 'News Monitor', role: 'Monitors web & market sources', status: 'idle', countKey: 'discovery', resultLabel: 'signals detected' },
  { name: 'Discovery Agent', role: 'Identifies ICP-matching companies', status: 'idle', countKey: 'discovery', resultLabel: 'companies' },
  { name: 'Validation Agent', role: 'Validates & enriches company data', status: 'idle', countKey: 'validation', resultLabel: 'valid' },
  { name: 'Research Agent', role: 'Deepens company intelligence', status: 'idle', countKey: 'research', resultLabel: 'enriched' },
  { name: 'Contact Agent', role: 'Identifies decision-makers by persona', status: 'idle', countKey: 'contacts', resultLabel: 'contacts' },
  { name: 'Recommendation Agent', role: 'Generates next best actions', status: 'idle', countKey: 'recommendation', resultLabel: 'actions' },
];

function App() {
  // Platform configuration state
  const [industry, setIndustry] = useState('Cybersecurity');
  const [trigger, setTrigger] = useState('Funding');
  
  // Pipeline orchestration/loading state
  const [loading, setLoading] = useState(false);
  const [animationStep, setAnimationStep] = useState(-1);
  const [toastMessage, setToastMessage] = useState('');
  
  // Result and user action state
  const [result, setResult] = useState(null);
  const [useMockMode, setUseMockMode] = useState(true); // default to true so it works instantly for local review/hackathon
  const [activeTab, setActiveTab] = useState('recommendations');
  const [approvedActions, setApprovedActions] = useState([]);
  const [rejectedCompanies, setRejectedCompanies] = useState([]);
  
  const [pipelineStages, setPipelineStages] = useState(defaultStages);
  const [showRawJson, setShowRawJson] = useState(false);
  const [formError, setFormError] = useState('');
  const [apiError, setApiError] = useState('');
  const [warningTimeout, setWarningTimeout] = useState(false);

  const pendingResultRef = useRef(null);
  const animationTimerRef = useRef(null);
  const timeoutTimerRef = useRef(null);

  // Auto-clear toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Handle pipeline animation steps
  useEffect(() => {
    if (animationStep === -1) return;

    const updatedStages = pipelineStages.map((stage, idx) => {
      let status = 'idle';
      if (idx < animationStep) {
        status = 'complete';
      } else if (idx === animationStep) {
        status = 'running';
      }
      
      // Calculate temporary count if results exist
      let count = 0;
      if (result) {
        if (idx === 0) count = result.discovery?.companies?.length || 0;
        if (idx === 1) count = result.discovery?.companies?.length || 0;
        if (idx === 2) count = result.validation?.validated_companies?.filter(c => c.is_valid).length || 0;
        if (idx === 3) count = result.research?.research_results?.length || 0;
        if (idx === 4) count = result.contacts?.contacts?.length || 0;
        if (idx === 5) count = result.recommendation?.recommendations?.length || 0;
      }
      return { ...stage, status, count };
    });
    setPipelineStages(updatedStages);

    // Complete pipeline when API has responded AND animation has reached stage 4 (Contact Agent)
    if (pendingResultRef.current && animationStep >= 4) {
      completePipeline(pendingResultRef.current);
    }
  }, [animationStep, result]);

  const completePipeline = (finalResult) => {
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
    
    // Read dynamic orchestration stages from backend response or compute fallback
    const completedStages = defaultStages.map((stage, idx) => {
      let status = 'complete';
      let reason = '';
      
      if (finalResult.orchestration?.stages?.[idx]) {
        status = finalResult.orchestration.stages[idx].status || 'complete';
        reason = finalResult.orchestration.stages[idx].reason || '';
      } else {
        // Javascript fallback logic for trigger orchestration rules
        const trig = (finalResult.request?.trigger || trigger).toLowerCase();
        if (trig === 'ipo') {
          if (idx >= 3) status = 'skipped';
        } else if (trig === 'acquisition') {
          if (idx === 4) status = 'skipped';
        } else if (trig === 'hiring') {
          if (idx === 3 || idx === 5) status = 'skipped';
        }
      }

      let count = 0;
      if (status === 'complete') {
        if (idx === 0) count = finalResult.discovery?.companies?.length || 0;
        if (idx === 1) count = finalResult.discovery?.companies?.length || 0;
        if (idx === 2) count = finalResult.validation?.validated_companies?.filter(c => c.is_valid).length || 0;
        if (idx === 3) count = finalResult.research?.research_results?.length || 0;
        if (idx === 4) count = finalResult.contacts?.contacts?.length || 0;
        if (idx === 5) count = finalResult.recommendation?.recommendations?.length || 0;
      }

      return { ...stage, status, count, reason };
    });

    setPipelineStages(completedStages);
    setResult(finalResult);
    setLoading(false);
    setAnimationStep(-1);
    setWarningTimeout(false);
    pendingResultRef.current = null;
    
    // Smart active tab mapping: default to recommendations unless skipped
    const isRecommendationsSkipped = completedStages.find(s => s.name === 'Recommendation Agent')?.status === 'skipped';
    if (isRecommendationsSkipped) {
      setActiveTab('signals');
    } else {
      setActiveTab('recommendations');
    }

    const oppCount = finalResult.recommendation?.recommendations?.length || 0;
    const qualifiedCount = finalResult.validation?.validated_companies?.filter(c => c.is_valid).length || 0;
    setToastMessage(`✅ Pipeline complete! ${qualifiedCount} qualified prospects discovered.`);
  };

  const handleLaunchPipeline = async (e) => {
    e.preventDefault();
    if (!industry.trim() || !trigger.trim()) {
      setFormError('Please enter both Industry and Trigger');
      return;
    }
    
    setFormError('');
    setApiError('');
    setWarningTimeout(false);
    setResult(null);
    setApprovedActions([]);
    setRejectedCompanies([]);
    setLoading(true);
    setAnimationStep(0);
    pendingResultRef.current = null;

    // Reset stages layout
    setPipelineStages(defaultStages.map(s => ({ ...s, status: 'idle', count: 0 })));

    // Begin standard pipeline step increments (every 800ms)
    let currentStep = 0;
    animationTimerRef.current = setInterval(() => {
      currentStep += 1;
      if (currentStep <= 5) {
        setAnimationStep(currentStep);
      } else {
        clearInterval(animationTimerRef.current);
      }
    }, 800);

    // Timeout alert
    timeoutTimerRef.current = setTimeout(() => {
      setWarningTimeout(true);
    }, 30000);

    if (useMockMode) {
      // Simulate network request latency
      setTimeout(() => {
        const finalMock = generateMockResponse(industry, trigger);
        pendingResultRef.current = finalMock;
        
        if (currentStep >= 4) {
          completePipeline(finalMock);
        }
      }, 1500);
    } else {
      try {
        const response = await fetch('http://localhost:8000/run-workflow', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ industry, trigger }),
        });

        if (!response.ok) {
          throw new Error('API failure');
        }

        const data = await response.json();
        pendingResultRef.current = data;

        if (currentStep >= 4) {
          completePipeline(data);
        }
      } catch (err) {
        if (animationTimerRef.current) clearInterval(animationTimerRef.current);
        if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
        setLoading(false);
        setAnimationStep(-1);
        setApiError('⚠️ Pipeline failed. Ensure backend is running at http://localhost:8000');
      }
    }
  };

  const handleApprove = (recommendation) => {
    if (approvedActions.some(act => act.company === recommendation.company)) return;
    
    const newApproval = {
      ...recommendation,
      approvedAt: new Date().toISOString()
    };
    setApprovedActions([...approvedActions, newApproval]);
    setToastMessage(`✅ Approved outreach for ${recommendation.company}`);
  };

  const handleReject = (companyName) => {
    if (rejectedCompanies.includes(companyName)) return;
    setRejectedCompanies([...rejectedCompanies, companyName]);
    setApprovedActions(approvedActions.filter(act => act.company !== companyName));
    setToastMessage(`❌ Rejected ${companyName} recommendation`);
  };

  const exportToCSV = () => {
    if (approvedActions.length === 0) return;
    const headers = ['Company', 'Priority', 'Action', 'Decision Maker', 'Email', 'Approved At'];
    const rows = approvedActions.map(act => [
      act.company,
      act.priority,
      act.recommended_action,
      act.decision_maker,
      act.email,
      act.approvedAt
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `approved_outreach_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage('📥 Exported approved leads to CSV!');
  };

  const copySummaryToClipboard = () => {
    if (approvedActions.length === 0) return;
    const summaryText = approvedActions.map((act, index) => {
      return `${index + 1}. [${act.priority}] ${act.company}
   Decision Maker: ${act.decision_maker} (${act.email})
   Recommended Action: ${act.recommended_action}
   Approved At: ${new Date(act.approvedAt).toLocaleString()}`;
    }).join('\n\n');
    
    navigator.clipboard.writeText(summaryText)
      .then(() => {
        setToastMessage('📋 Copy successful! Summary on clipboard.');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // Helper variables for analytics computations
  const processedCompaniesCount = result?.discovery?.companies?.length || 0;
  const qualifiedCompaniesCount = result?.validation?.validated_companies?.filter(c => c.is_valid).length || 0;
  const icpRate = processedCompaniesCount > 0 ? Math.round((qualifiedCompaniesCount / processedCompaniesCount) * 100) : 0;
  const totalRecs = result?.recommendation?.recommendations?.length || 0;
  const approvalRate = totalRecs > 0 ? Math.round((approvedActions.length / totalRecs) * 100) : 0;
  
  const avgValidationScore = result?.validation?.validated_companies?.length 
    ? Math.round(result.validation.validated_companies.reduce((sum, c) => sum + c.validation_score, 0) / result.validation.validated_companies.length)
    : 0;

  // Check skipped agent stages status for alerts rendering
  const isResearchSkipped = pipelineStages.find(s => s.name === 'Research Agent')?.status === 'skipped';
  const researchSkippedReason = pipelineStages.find(s => s.name === 'Research Agent')?.reason || '';
  
  const isContactsSkipped = pipelineStages.find(s => s.name === 'Contact Agent')?.status === 'skipped';
  const contactsSkippedReason = pipelineStages.find(s => s.name === 'Contact Agent')?.reason || '';
  
  const isRecommendationsSkipped = pipelineStages.find(s => s.name === 'Recommendation Agent')?.status === 'skipped';
  const recommendationsSkippedReason = pipelineStages.find(s => s.name === 'Recommendation Agent')?.reason || '';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col antialiased">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800 border border-emerald-500/50 text-emerald-400 px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 animate-fade-in font-medium">
          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SECTION 1: HEADER / NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 z-40 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-8 h-8">
            <div className="absolute w-8 h-8 rounded-full border border-blue-500/40 animate-ping"></div>
            <div className="absolute w-6 h-6 rounded-full border-2 border-blue-500/60"></div>
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Agentic Opportunity Intelligence Platform
          </span>
        </div>

        <div className="hidden md:block text-slate-400 font-medium text-sm border-l border-slate-800 pl-4">
          Intelligent Next Best Action Platform
        </div>

        <div className="flex items-center space-x-3">
          {/* Mock / Live trigger toggle */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-full p-1 mr-2 text-xs">
            <button
              onClick={() => setUseMockMode(false)}
              className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${!useMockMode ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Live API
            </button>
            <button
              onClick={() => setUseMockMode(true)}
              className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${useMockMode ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Demo Mode
            </button>
          </div>

          <span className="bg-blue-900/40 text-blue-400 border border-blue-800/60 rounded-full px-3 py-1 text-xs font-semibold">
            Agentic AI Platform
          </span>
          <span className="bg-purple-900/40 text-purple-400 border border-purple-800/60 rounded-full px-3 py-1 text-xs font-semibold">
            B2B Sales Intelligence
          </span>
        </div>
      </nav>

      {/* Main layout */}
      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {apiError && (
          <div className="bg-rose-950/40 border border-rose-800/80 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-bold text-rose-200">Pipeline Execution Error</h4>
                <p className="text-sm text-rose-300/90">{apiError}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setUseMockMode(true);
                setApiError('');
              }}
              className="bg-rose-900/60 hover:bg-rose-800 text-rose-100 border border-rose-700 px-4 py-2 rounded-lg font-semibold text-xs tracking-wider transition-all"
            >
              Switch to Offline Demo Mode
            </button>
          </div>
        )}

        {warningTimeout && (
          <div className="bg-amber-950/30 border border-amber-800/60 rounded-xl p-4 flex items-center space-x-3 text-amber-200 animate-fade-in">
            <span className="text-xl">⏳</span>
            <p className="text-sm">
              Request is taking longer than expected. The AI agents are querying Google News RSS, validating target profiles, and analyzing executive positions...
            </p>
          </div>
        )}

        {/* Hero Banner */}
        <section className="bg-slate-800/50 border border-slate-800 p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-slate-900/60 border border-slate-700 px-3 py-1 rounded-full text-xs text-blue-400 font-semibold uppercase tracking-wider">
              <span>XLVentures.AI Hackathon Submission</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              B2B Lead Discovery & Prospect Intelligence
            </h1>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              B2B sales teams lose thousands of hours manually monitoring news, identifying potential buyers, and qualifying leads. 
              This is an Agentic AI Platform which automates this entire process. It monitors live market signals, 
              identifies companies matching a defined Ideal Customer Profile (ICP), validates and enriches them, discovers decision-makers, 
              and recommends prioritized next actions — with human approval before any outreach begins.
            </p>
          </div>
          <div className="hidden lg:block w-48 h-48 relative flex-shrink-0">
            <div className="absolute inset-0 rounded-full border border-slate-700/60 flex items-center justify-center">
              <div className="w-5/6 h-5/6 rounded-full border border-slate-700/40 flex items-center justify-center">
                <div className="w-2/3 h-2/3 rounded-full border border-slate-700/20 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/40 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
            <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
            <div className="absolute inset-0 rounded-full border-t border-blue-500/80 animate-[spin_4s_linear_infinite] origin-center pointer-events-none"></div>
          </div>
        </section>

        {/* SECTION 2: CONFIGURATION PANEL */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-700/50 pb-3">
                <h3 className="font-bold text-white text-md tracking-wider flex items-center space-x-2">
                  <span>Ideal Customer Profile (ICP) Rules</span>
                </h3>
                <span className="text-slate-500 text-xs uppercase font-mono">Readonly Profile</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/60 border border-slate-700/40 rounded-lg p-3">
                  <span className="text-xs text-slate-500 block">Business Domain</span>
                  <span className="text-sm font-semibold text-slate-200">Cybersecurity SaaS</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-700/40 rounded-lg p-3">
                  <span className="text-xs text-slate-500 block">Company Stage</span>
                  <span className="text-sm font-semibold text-slate-200">Series A / Series B</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-700/40 rounded-lg p-3">
                  <span className="text-xs text-slate-500 block">Company Size</span>
                  <span className="text-sm font-semibold text-slate-200">50–500 Employees</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-700/40 rounded-lg p-3">
                  <span className="text-xs text-slate-500 block">Geography</span>
                  <span className="text-sm font-semibold text-slate-200">India, SEA, MENA</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
              <span className="text-slate-400">Budget Qualification Signal:</span>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded font-mono font-semibold">
                Funding &gt; $5M USD
              </span>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-700/50 pb-3">
                <h3 className="font-bold text-white text-md tracking-wider flex items-center space-x-2">
                  <span>Target Decision-Maker Personas</span>
                </h3>
                <span className="text-slate-500 text-xs uppercase font-mono">Outreach Hierarchy</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {['CTO', 'CISO', 'VP Engineering', 'Head of Security'].map((persona) => (
                  <div 
                    key={persona} 
                    className="flex items-center space-x-2 bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-lg hover:border-blue-500/50 transition-colors cursor-default"
                  >
                    <span className="text-sm">🎯</span>
                    <span className="text-sm font-medium text-slate-200">{persona}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-slate-500 text-xs mt-4 pt-3 border-t border-slate-700/50 italic">
              📌 System agents will inspect and extract contact credentials matching these target roles.
            </p>
          </div>

          <div className="lg:col-span-2 bg-slate-800/40 border border-slate-800 p-6 rounded-xl flex flex-col gap-4">
            <form onSubmit={handleLaunchPipeline} className="grid grid-cols-1 md:grid-cols-3 items-end gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 block" htmlFor="industry-input">
                  Industry Vertical
                </label>
                <input
                  id="industry-input"
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Cybersecurity"
                  disabled={loading}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg px-4 py-2.5 text-slate-200 outline-none text-sm transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 block" htmlFor="trigger-input">
                  Business Trigger Event
                </label>
                <select
                  id="trigger-input"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg px-4 py-2.5 text-slate-200 outline-none text-sm transition-all shadow-md cursor-pointer"
                >
                  {['Funding', 'Acquisition', 'Expansion', 'IPO', 'Hiring'].map(trig => (
                    <option key={trig} value={trig}>{trig}</option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:border-slate-700 border border-transparent shadow-[0_4px_16px_rgba(59,130,246,0.35)] px-6 py-2.5 font-bold rounded-lg text-sm text-white tracking-wide transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Pipeline Orchestration Active...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀 Launch Agent Pipeline</span>
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {formError && (
              <p className="text-rose-400 text-xs font-semibold animate-fade-in">{formError}</p>
            )}

            <div className="text-slate-500 text-xs text-center border-t border-slate-800 pt-3">
              Planner Agent will dynamically orchestrate 6 specialized agents based on your configuration.
            </div>
          </div>
        </section>

        {/* SECTION 3: AGENT PIPELINE ORCHESTRATION VISUALIZER */}
        <section className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-700/50 pb-3 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-lg font-bold text-white">Planner Agent — Dynamic Orchestration</h2>
              <p className="text-slate-400 text-xs">Orchestrating specialized agents in real-time</p>
            </div>
            
            <div className="mt-2 md:mt-0 bg-slate-900 border border-slate-755/50 rounded px-2.5 py-1 text-[11px] font-semibold flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
              <span className="text-slate-400">Trigger:</span>
              <span className="text-blue-400 font-mono">{trigger.toUpperCase()}</span>
            </div>
          </div>

          {/* Node Cards Flex */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
            {pipelineStages.map((stage, idx) => {
              const isRunning = stage.status === 'running';
              const isComplete = stage.status === 'complete';
              const isSkipped = stage.status === 'skipped';
              const isIdle = stage.status === 'idle';
              
              // Custom SVGs for specific agents
              let agentIcon = (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              );
              if (idx === 0) { // News Monitor
                agentIcon = (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                );
              } else if (idx === 1) { // Discovery
                agentIcon = (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                );
              } else if (idx === 2) { // Validation
                agentIcon = (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                );
              } else if (idx === 3) { // Research
                agentIcon = (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                );
              } else if (idx === 4) { // Contact
                agentIcon = (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                );
              } else if (idx === 5) { // Recommendation
                agentIcon = (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                );
              }

              return (
                <div 
                  key={stage.name}
                  className={`bg-slate-900 border rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all duration-300 relative ${
                    isRunning 
                      ? 'border-blue-500 ring-1 ring-blue-500/30 animate-pulse-running' 
                      : isComplete 
                        ? 'border-emerald-500/50 bg-emerald-950/5' 
                        : isSkipped 
                          ? 'border-amber-500/40 bg-amber-950/5' 
                          : 'border-slate-800'
                  }`}
                  title={isSkipped ? stage.reason : undefined}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className={`p-1.5 rounded-lg ${
                        isRunning 
                          ? 'text-blue-400 bg-blue-900/30' 
                          : isComplete 
                            ? 'text-emerald-400 bg-emerald-900/30' 
                            : isSkipped 
                              ? 'text-amber-450 bg-amber-900/30' 
                              : 'text-slate-500 bg-slate-800/40'
                      }`}>
                        {agentIcon}
                      </div>
                      
                      {/* Status badge */}
                      {isIdle && <span className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-semibold">Idle</span>}
                      {isRunning && <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded-full font-semibold animate-pulse">Running</span>}
                      {isComplete && <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 rounded-full font-semibold">Complete</span>}
                      {isSkipped && <span className="text-[10px] bg-amber-950/80 text-amber-400 border border-amber-900/60 px-2 py-0.5 rounded-full font-semibold">Skipped</span>}
                    </div>

                    <h4 className={`text-xs font-bold ${
                      isRunning ? 'text-blue-400' : isComplete ? 'text-emerald-400' : isSkipped ? 'text-amber-400/90 font-semibold' : 'text-slate-300'
                    }`}>
                      {stage.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {stage.role}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono font-semibold">
                    <span className="text-slate-500">Output:</span>
                    {isComplete ? (
                      <span className="text-emerald-400">{stage.count} {stage.resultLabel}</span>
                    ) : isSkipped ? (
                      <span className="text-amber-550/80">Skipped</span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Shared Memory Indicator */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-300 flex items-center space-x-2">
              <span>🧠 Shared Memory Logs:</span>
            </span>
            <div className="flex flex-wrap gap-2.5 font-mono text-xs">
              {[
                { key: 'discovery', label: 'discovery' },
                { key: 'validation', label: 'validation' },
                { key: 'research', label: 'research' },
                { key: 'contacts', label: 'contacts' },
                { key: 'recommendation', label: 'recommendation' }
              ].map((item, idx) => {
                const correspondingStage = pipelineStages[idx + 1];
                const isLit = correspondingStage && (correspondingStage.status === 'complete');
                const isSkipped = correspondingStage && (correspondingStage.status === 'skipped');

                return (
                  <span
                    key={item.key}
                    className={`px-3 py-1 rounded border transition-all duration-300 ${
                      isLit 
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60 shadow-[0_0_8px_rgba(16,185,129,0.15)] font-bold' 
                        : isSkipped
                          ? 'bg-amber-950/30 text-amber-500 border-amber-900/40 italic'
                          : 'bg-slate-800 text-slate-600 border-slate-700/60'
                    }`}
                  >
                    [{item.label} {isLit ? '✅' : isSkipped ? '⏭️' : '⏳'}]
                  </span>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 4: SUMMARY METRICS */}
        {result && (
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
            <div className="bg-slate-800 border border-slate-700/80 p-5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Signals Detected</span>
                <span className="text-2xl md:text-3xl font-extrabold text-white mt-1 block">
                  {processedCompaniesCount}
                </span>
              </div>
              <div className="text-3xl">📰</div>
            </div>

            <div className="bg-slate-800 border border-slate-700/80 p-5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">ICP Qualified</span>
                <span className="text-2xl md:text-3xl font-extrabold text-emerald-400 mt-1 block">
                  {qualifiedCompaniesCount}
                </span>
              </div>
              <div className="text-3xl">✅</div>
            </div>

            <div className="bg-slate-800 border border-slate-700/80 p-5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Contacts Found</span>
                <span className="text-2xl md:text-3xl font-extrabold text-purple-400 mt-1 block">
                  {isContactsSkipped ? "0" : (result.contacts?.contacts?.length || 0)}
                </span>
              </div>
              <div className="text-3xl">👤</div>
            </div>

            <div className="bg-slate-800 border border-slate-700/80 p-5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Actions Recommended</span>
                <span className="text-2xl md:text-3xl font-extrabold text-blue-400 mt-1 block">
                  {isRecommendationsSkipped ? "0" : totalRecs}
                </span>
              </div>
              <div className="text-3xl">🎯</div>
            </div>
          </section>
        )}

        {/* Tab Selection */}
        {result && (
          <div className="space-y-6">
            
            {/* Scrollable Tabs */}
            <div className="border-b border-slate-850 overflow-x-auto">
              <div className="flex space-x-6 min-w-max pb-1">
                {[
                  { id: 'recommendations', label: '💡 Recommended Actions', disabled: isRecommendationsSkipped },
                  { id: 'signals', label: '📰 Market Signals', disabled: false },
                  { id: 'validation', label: '✅ ICP Validation', disabled: false },
                  { id: 'intelligence', label: '🔬 Company Intelligence', disabled: isResearchSkipped },
                  { id: 'contacts', label: '👤 Decision-Makers', disabled: isContactsSkipped },
                  { id: 'memory', label: '🧠 Agent Memory', disabled: false },
                  { id: 'analytics', label: '📊 Platform Analytics', disabled: false },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-1 font-bold text-sm tracking-wide transition-all border-b-2 outline-none cursor-pointer flex items-center space-x-1.5 ${
                      activeTab === tab.id 
                        ? 'border-blue-500 text-white font-extrabold' 
                        : tab.disabled 
                          ? 'border-transparent text-slate-600 cursor-not-allowed opacity-50'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.disabled && <span className="text-[9px] bg-slate-800 text-slate-500 px-1 py-0.2 rounded font-mono">skipped</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENTS */}
            <div className="bg-slate-900">
              
              {/* TAB 1: MARKET SIGNALS */}
              {activeTab === 'signals' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h3 className="text-lg font-bold text-white">Live Market Trigger Monitoring</h3>
                    <p className="text-xs text-slate-400">Factual news and web sources monitored for configured business triggers</p>
                  </div>

                  {result.discovery?.companies?.length === 0 ? (
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center text-slate-400">
                      No companies detected. Try adjusting your industry vertical or trigger keyword filters.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.discovery?.companies?.map((c, index) => {
                        const isValid = result.validation?.validated_companies?.find(vc => vc.company === c.company)?.is_valid;
                        return (
                          <div 
                            key={index} 
                            className={`bg-slate-800 border p-5 rounded-xl flex flex-col justify-between space-y-4 hover:border-slate-500 transition ${
                              isValid === true 
                                ? 'border-emerald-800/60 shadow-[0_4px_12px_rgba(16,185,129,0.05)]' 
                                : isValid === false 
                                  ? 'border-rose-900/40 opacity-75' 
                                  : 'border-slate-800'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <div className="max-w-[70%]">
                                  <h4 className="font-extrabold text-white text-base truncate">{c.company}</h4>
                                  <span className="text-[10px] text-slate-500 font-mono">Published: {c.published_at ? new Date(c.published_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) : "Recent"}</span>
                                </div>
                                <div className="flex space-x-1.5 flex-shrink-0">
                                  <span className="bg-blue-900/40 text-blue-400 border border-blue-800/60 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                    {c.trigger}
                                  </span>
                                  <span className="bg-slate-900 text-slate-400 border border-slate-800 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">
                                    {c.confidence}% conf
                                  </span>
                                </div>
                              </div>

                              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                                {c.summary}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                              <span className="text-slate-500">Source: <strong className="text-slate-300 font-semibold">{c.source}</strong></span>
                              <a 
                                href={c.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
                              >
                                <span>View Source</span>
                                <span>→</span>
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ICP VALIDATION */}
              {activeTab === 'validation' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h3 className="text-lg font-bold text-white">ICP Qualification & Validation</h3>
                    <p className="text-xs text-slate-400">Companies scored against Ideal Customer Profile criteria</p>
                  </div>

                  <div className="space-y-3">
                    {[...(result.validation?.validated_companies || [])]
                      .sort((a, b) => b.validation_score - a.validation_score)
                      .map((c, index) => {
                        const isScoreHigh = c.validation_score >= 90;
                        const isScoreMed = c.validation_score >= 75;
                        
                        let barColor = 'bg-rose-600';
                        let textColor = 'text-rose-400';
                        let badgeBg = 'bg-rose-950 border-rose-800/60';
                        if (isScoreHigh) {
                          barColor = 'bg-emerald-500';
                          textColor = 'text-emerald-400';
                          badgeBg = 'bg-emerald-950 border-emerald-800/60';
                        } else if (isScoreMed) {
                          barColor = 'bg-orange-500';
                          textColor = 'text-orange-400';
                          badgeBg = 'bg-orange-950 border-orange-800/60';
                        }

                        return (
                          <div 
                            key={index} 
                            className={`bg-slate-800 border p-5 rounded-xl hover:border-slate-500 transition grid grid-cols-1 lg:grid-cols-12 gap-4 items-center ${
                              c.is_valid ? 'border-emerald-800/40' : 'border-rose-900/40 opacity-75'
                            }`}
                          >
                            <div className="lg:col-span-3 space-y-1">
                              <h4 className="font-extrabold text-white text-base flex items-center space-x-2">
                                <span>{c.company}</span>
                                {c.is_valid ? (
                                  <span className="text-emerald-400 text-sm font-semibold">✅</span>
                                ) : (
                                  <span className="text-rose-400 text-sm font-semibold">❌</span>
                                )}
                              </h4>
                              <span className="bg-slate-900 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-800 uppercase">
                                {c.industry}
                              </span>
                            </div>

                            <div className="lg:col-span-4 space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-semibold">Fit Index</span>
                                <span className={`font-mono font-bold ${textColor}`}>{c.validation_score} / 100</span>
                              </div>
                              <div className="bg-slate-950 h-2 w-full rounded-full overflow-hidden border border-slate-800">
                                <div className={`h-full ${barColor} transition-all`} style={{ width: `${c.validation_score}%` }}></div>
                              </div>
                            </div>

                            <div className="lg:col-span-3">
                              <span className={`inline-block border text-[11px] font-bold px-3 py-1 rounded-full ${badgeBg} ${textColor}`}>
                                {c.validation_reason}
                              </span>
                            </div>

                            <div className="lg:col-span-2 text-right">
                              <div className="text-[10px] text-slate-500 font-mono tracking-tighter leading-tight">
                                <div>ICP Status:</div>
                                <div className={`font-bold mt-0.5 ${c.is_valid ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {c.is_valid ? '✅ Qualified' : '❌ Not Qualified'}
                                </div>
                                <div className="text-[9px] text-slate-600 mt-2 font-mono">
                                  Src · Trig · Fresh · Conf
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* TAB 3: COMPANY INTELLIGENCE */}
              {activeTab === 'intelligence' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h3 className="text-lg font-bold text-white">Enriched Company Research</h3>
                    <p className="text-xs text-slate-400">Deep intelligence gathered on ICP-qualified companies</p>
                  </div>

                  {isResearchSkipped ? (
                    <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-8 text-center space-y-3 max-w-xl mx-auto shadow-md">
                      <div className="text-3xl text-amber-500">⏭️</div>
                      <h4 className="font-extrabold text-white text-base">Research Agent Skipped</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {researchSkippedReason || "Deep financial intelligence gathering was bypassed by the Planner Agent for this trigger vertical."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.research?.research_results?.map((item, index) => {
                        const companyScore = result.validation?.validated_companies?.find(vc => vc.company === item.name)?.validation_score || item.validation_score || 90;
                        
                        return (
                          <div key={index} className="bg-slate-800 border border-slate-700 p-5 rounded-xl hover:border-slate-500 transition flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-extrabold text-white text-base">{item.name}</h4>
                                <span className="bg-indigo-950 text-indigo-400 border border-indigo-900/60 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                  {item.industry}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                                {item.summary}
                              </p>
                            </div>

                            <div className="space-y-3 pt-3 border-t border-slate-800/80">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500">Qualifying Reason:</span>
                                <span className="text-slate-300 font-semibold text-[11px] truncate max-w-xs">{item.reason}</span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-900/40 px-2.5 py-0.5 rounded font-mono font-semibold">
                                    Score: {companyScore}/100
                                  </span>
                                </div>
                                <span className="text-blue-400 text-xs font-bold tracking-wide flex items-center space-x-1 animate-pulse">
                                  <span>Passed to Contact Discovery</span>
                                  <span>→</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: DECISION-MAKER DISCOVERY */}
              {activeTab === 'contacts' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h3 className="text-lg font-bold text-white">Contact Intelligence by Persona</h3>
                    <p className="text-xs text-slate-400">Decision-makers identified matching configured target personas</p>
                  </div>

                  {isContactsSkipped ? (
                    <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-8 text-center space-y-3 max-w-xl mx-auto shadow-md">
                      <div className="text-3xl text-amber-500">⏭️</div>
                      <h4 className="font-extrabold text-white text-base">Contact Agent Skipped</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {contactsSkippedReason || "Lead contact credential mining was bypassed by the Planner Agent for this trigger type."}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-900/80 border-b border-slate-700 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                              <th className="p-4">Company</th>
                              <th className="p-4">Decision Maker</th>
                              <th className="p-4">Persona</th>
                              <th className="p-4">Email Address</th>
                              <th className="p-4">Score</th>
                              <th className="p-4">ICP Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700/50 text-xs">
                            {result.contacts?.contacts?.map((contact, index) => {
                              const isHigh = contact.validation_score >= 90;
                              const isMed = contact.validation_score >= 75;
                              
                              let badgeColor = 'bg-rose-950 text-rose-400 border border-rose-800';
                              if (isHigh) {
                                badgeColor = 'bg-emerald-950 text-emerald-400 border border-emerald-800';
                              } else if (isMed) {
                                badgeColor = 'bg-orange-950 text-orange-400 border border-orange-800';
                              }

                              let personaBadge = 'CTO';
                              if (contact.decision_maker.toLowerCase().includes('sarah') || contact.decision_maker.toLowerCase().includes('amanda')) {
                                personaBadge = 'CISO';
                              } else if (contact.decision_maker.toLowerCase().includes('vikram') || contact.decision_maker.toLowerCase().includes('neha')) {
                                personaBadge = 'VP Engineering';
                              } else if (contact.decision_maker.toLowerCase().includes('rajesh') || contact.decision_maker.toLowerCase().includes('arjun')) {
                                personaBadge = 'CTO';
                              } else {
                                personaBadge = 'Head of Security';
                              }

                              return (
                                <tr key={index} className="hover:bg-slate-850 transition">
                                  <td className="p-4 font-bold text-slate-200">{contact.company}</td>
                                  <td className="p-4 font-semibold text-white">{contact.decision_maker}</td>
                                  <td className="p-4">
                                    <span className="bg-blue-950 text-blue-400 border border-blue-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                                      🎯 {personaBadge}
                                    </span>
                                  </td>
                                  <td className="p-4 font-mono">
                                    <a 
                                      href={`mailto:${contact.email}`}
                                      className="inline-flex items-center space-x-1.5 bg-slate-900 border border-slate-700 hover:border-blue-500 text-blue-400 px-3 py-1 rounded font-medium hover:text-white transition-all"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                      </svg>
                                      <span>{contact.email}</span>
                                    </a>
                                  </td>
                                  <td className="p-4 font-mono">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeColor}`}>
                                      {contact.validation_score}
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <span className="text-emerald-400 font-semibold">{contact.status}</span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {!isContactsSkipped && (
                    <p className="text-slate-500 text-xs italic">
                      📌 Contact enrichment includes Email identification based on target persona configuration.
                    </p>
                  )}
                </div>
              )}

              {/* TAB 5: RECOMMENDED ACTIONS */}
              {activeTab === 'recommendations' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {isRecommendationsSkipped ? (
                    <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-8 text-center space-y-3 max-w-xl mx-auto shadow-md">
                      <div className="text-3xl text-amber-500">⏭️</div>
                      <h4 className="font-extrabold text-white text-base">Recommendation Agent Skipped</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {recommendationsSkippedReason || "Outreach recommendation generation was bypassed by the Planner Agent for this trigger parameters."}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-amber-950/30 border border-amber-800/50 rounded-xl p-4 flex items-start space-x-3 text-amber-300">
                        <span className="text-lg">⚠️</span>
                        <div>
                          <h4 className="font-bold text-sm">Human-in-the-Loop Orchestration Required</h4>
                          <p className="text-xs text-amber-400/90 leading-normal mt-0.5">
                            Review and approve each recommendation before it is actioned. Approved entries are queued for email outreach. Rejected items will be archived and will not proceed.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {result.recommendation?.recommendations?.map((rec, index) => {
                          const isApproved = approvedActions.some(act => act.company === rec.company);
                          const isRejected = rejectedCompanies.includes(rec.company);
                          
                          const isCritical = rec.priority === 'Critical';
                          const isHigh = rec.priority === 'High';
                          const isMed = rec.priority === 'Medium';
                          
                          let priorityClass = 'bg-slate-900 text-slate-400 border border-slate-800';
                          if (isCritical) {
                            priorityClass = 'bg-rose-950 text-rose-400 border border-rose-800/80';
                          } else if (isHigh) {
                            priorityClass = 'bg-orange-950 text-orange-400 border border-orange-800/80';
                          } else if (isMed) {
                            priorityClass = 'bg-amber-950 text-amber-400 border border-amber-800/80';
                          }

                          // SVG stroke dasharray circular calculations
                          const radius = 22;
                          const circumference = 2 * Math.PI * radius;
                          const strokeDashoffset = circumference - (rec.validation_score / 100) * circumference;

                          return (
                            <div 
                              key={index} 
                              className={`bg-slate-800 border p-6 rounded-xl relative transition-all duration-300 flex flex-col md:flex-row gap-6 items-start justify-between overflow-hidden ${
                                isApproved 
                                  ? 'border-emerald-500 shadow-[0_4px_16px_rgba(16,185,129,0.1)]' 
                                  : isRejected 
                                    ? 'border-slate-800 opacity-30 select-none' 
                                    : 'border-slate-700 shadow-md hover:border-slate-500'
                              }`}
                            >
                              {/* Stamp overlays */}
                              {isApproved && (
                                <div className="absolute top-4 right-4 z-10 bg-emerald-900/80 text-emerald-400 border-2 border-emerald-500 font-extrabold text-sm px-4 py-1.5 rounded-lg rotate-12 uppercase tracking-widest shadow-lg pointer-events-none select-none">
                                  Approved ✓
                                </div>
                              )}
                              {isRejected && (
                                <div className="absolute top-4 right-4 z-10 bg-rose-900/80 text-rose-400 border-2 border-rose-500 font-extrabold text-sm px-4 py-1.5 rounded-lg -rotate-12 uppercase tracking-widest shadow-lg pointer-events-none select-none">
                                  Rejected ❌
                                </div>
                              )}

                              {/* Core contents */}
                              <div className="flex-grow space-y-4 w-full md:w-3/4">
                                <div className="flex items-center space-x-3">
                                  <h4 className="text-xl font-extrabold text-white">{rec.company}</h4>
                                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${priorityClass}`}>
                                    {rec.priority}
                                  </span>
                                </div>

                                <div className="bg-slate-900/85 border border-slate-750 p-4 rounded-lg">
                                  <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider mb-1">Recommended Action</span>
                                  <p className="text-sm font-semibold text-slate-100 font-sans leading-relaxed">
                                    {rec.recommended_action}
                                  </p>
                                </div>

                                <div className="text-xs text-slate-400 font-medium italic leading-relaxed border-l-2 border-slate-700 pl-3">
                                  &ldquo;{rec.why}&rdquo;
                                </div>

                                <div className="flex flex-wrap gap-2 text-[10px] text-slate-500">
                                  <span className="bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800">
                                    Trigger Event: <strong className="text-slate-300 font-semibold uppercase">{trigger}</strong>
                                  </span>
                                  <span className="bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800">
                                    Validation Score: <strong className="text-blue-400 font-bold">{rec.validation_score}/100</strong>
                                  </span>
                                </div>

                                <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-base">👤</span>
                                    <div>
                                      <span className="font-semibold text-slate-200 block">{rec.decision_maker}</span>
                                      <span className="text-[10px] text-slate-500 uppercase font-semibold">CISO / Executive Persona</span>
                                    </div>
                                  </div>
                                  <a 
                                    href={`mailto:${rec.email}`}
                                    className="bg-slate-800 border border-slate-750 hover:border-slate-650 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded font-semibold flex items-center space-x-1.5 transition-all w-full sm:w-auto justify-center"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span>{rec.email}</span>
                                  </a>
                                </div>
                              </div>

                              {/* Ring score & actions buttons */}
                              <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 w-full md:w-1/4 h-full pt-4 md:pt-0">
                                <div className="relative w-16 h-16 flex items-center justify-center">
                                  <svg className="w-full h-full transform -rotate-90">
                                    <circle 
                                      cx="32" 
                                      cy="32" 
                                      r={radius} 
                                      className="text-slate-700" 
                                      strokeWidth="4" 
                                      stroke="currentColor" 
                                      fill="transparent" 
                                    />
                                    <circle 
                                      cx="32" 
                                      cy="32" 
                                      r={radius} 
                                      className={rec.validation_score >= 90 ? 'text-emerald-500' : rec.validation_score >= 75 ? 'text-orange-500' : 'text-rose-500'} 
                                      strokeWidth="4" 
                                      strokeDasharray={circumference} 
                                      strokeDashoffset={strokeDashoffset} 
                                      strokeLinecap="round" 
                                      stroke="currentColor" 
                                      fill="transparent" 
                                    />
                                  </svg>
                                  <div className="absolute flex flex-col items-center justify-center font-mono">
                                    <span className="text-sm font-extrabold text-slate-100">{rec.validation_score}</span>
                                    <span className="text-[8px] text-slate-500 uppercase tracking-tighter">fit</span>
                                  </div>
                                </div>

                                <div className="flex md:flex-col gap-2 w-full md:w-auto">
                                  <button
                                    onClick={() => handleApprove(rec)}
                                    disabled={isApproved || isRejected}
                                    className={`flex-1 md:w-36 py-2 px-3 rounded-lg font-bold text-xs tracking-wider transition-all duration-205 border cursor-pointer ${
                                      isApproved 
                                        ? 'bg-emerald-950 border-emerald-900 text-emerald-500 cursor-not-allowed opacity-80' 
                                        : 'bg-emerald-600 hover:bg-emerald-500 text-white border-transparent shadow-[0_2px_8px_rgba(16,185,129,0.2)]'
                                    }`}
                                  >
                                    {isApproved ? 'Approved ✓' : 'Approve & Queue'}
                                  </button>
                                  <button
                                    onClick={() => handleReject(rec.company)}
                                    disabled={isApproved || isRejected}
                                    className={`flex-1 md:w-36 py-2 px-3 rounded-lg font-bold text-xs tracking-wider transition-all duration-205 border cursor-pointer ${
                                      isRejected 
                                        ? 'bg-rose-950 border-rose-900 text-rose-500 cursor-not-allowed opacity-80' 
                                        : 'bg-transparent hover:bg-rose-950 border-rose-800 text-rose-450'
                                    }`}
                                  >
                                    {isRejected ? 'Rejected' : '❌ Reject'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* APPROVED ACTIONS TABLE */}
                      {approvedActions.length >= 1 && (
                        <div className="mt-8 bg-slate-800 border-2 border-emerald-500/20 rounded-xl p-6 shadow-2xl space-y-4 animate-fade-in">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-3">
                            <div>
                              <h3 className="text-base font-extrabold text-emerald-400 flex items-center space-x-2">
                                <span>📋 Queued for Outreach ({approvedActions.length})</span>
                              </h3>
                              <p className="text-slate-500 text-xs mt-0.5">Leads qualified and approved for the next outreach cycle</p>
                            </div>

                            <div className="flex items-center space-x-2.5">
                              <button
                                onClick={copySummaryToClipboard}
                                className="bg-slate-900 hover:bg-slate-950 border border-slate-750 text-slate-300 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
                              >
                                <span>📋</span>
                                <span>Copy Summary</span>
                              </button>
                              
                              <button
                                onClick={exportToCSV}
                                className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
                              >
                                <span>📥</span>
                                <span>Export CSV</span>
                              </button>
                            </div>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-900/60 border-b border-slate-850 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                  <th className="p-3">Company</th>
                                  <th className="p-3">Priority</th>
                                  <th className="p-3">Outreach Action</th>
                                  <th className="p-3">Decision Maker</th>
                                  <th className="p-3">Email</th>
                                  <th className="p-3 text-right">Approved At</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-850 text-xs">
                                {approvedActions.map((act, index) => {
                                  const isCritical = act.priority === 'Critical';
                                  const isHigh = act.priority === 'High';
                                  
                                  let priorityClass = 'text-amber-400';
                                  if (isCritical) priorityClass = 'text-rose-400';
                                  else if (isHigh) priorityClass = 'text-orange-400';

                                  return (
                                    <tr key={index} className="hover:bg-slate-850/40 text-slate-300 transition">
                                      <td className="p-3 font-bold text-white">{act.company}</td>
                                      <td className={`p-3 font-semibold ${priorityClass}`}>{act.priority}</td>
                                      <td className="p-3 font-medium truncate max-w-xs">{act.recommended_action}</td>
                                      <td className="p-3 font-semibold text-slate-200">{act.decision_maker}</td>
                                      <td className="p-3 font-mono text-slate-400">{act.email}</td>
                                      <td className="p-3 text-right font-mono text-[10px] text-slate-500">
                                        {new Date(act.approvedAt).toLocaleTimeString()}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* TAB 6: AGENT MEMORY */}
              {activeTab === 'memory' && (
                <div className="space-y-6 animate-fade-in font-sans">
                  <div>
                    <h3 className="text-lg font-bold text-white font-sans">Shared Memory Inspector</h3>
                    <p className="text-xs text-slate-400">Context retained across agents to avoid duplicate work and enable intelligent orchestration</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { key: 'discovery', agent: 'CompanyDiscoveryAgent', summary: `${processedCompaniesCount} companies extracted from live news feeds` },
                      { key: 'validation', agent: 'ICPValidationAgent', summary: `${qualifiedCompaniesCount} ICP-qualified / ${processedCompaniesCount - qualifiedCompaniesCount} rejected` },
                      { key: 'research', agent: 'CompanyIntelligenceAgent', summary: isResearchSkipped ? "Skipped by Planner rules" : `${result.research?.research_results?.length || 0} companies enriched with intelligence` },
                      { key: 'contacts', agent: 'ContactDiscoveryAgent', summary: isContactsSkipped ? "Skipped by Planner rules" : `${result.contacts?.contacts?.length || 0} decision-makers identified by persona` },
                      { key: 'recommendation', agent: 'NextActionRecommendationAgent', summary: isRecommendationsSkipped ? "Skipped by Planner rules" : `${totalRecs} strategic outreach actions queued with validation scoring` }
                    ].map((entry, idx) => {
                      const correspondingStage = pipelineStages[idx + 1];
                      const isSkipped = correspondingStage && (correspondingStage.status === 'skipped');

                      return (
                        <div 
                          key={entry.key}
                          className={`bg-slate-800 border p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-500 transition ${
                            isSkipped ? 'border-amber-900/35 opacity-75' : 'border-slate-700/80'
                          }`}
                        >
                          <div className="space-y-1">
                            <span className={`font-mono text-xs font-bold ${isSkipped ? 'text-amber-500' : 'text-blue-400'}`}>
                              {entry.key}
                            </span>
                            <div className="text-[10px] text-slate-500">
                              Written by: <span className="font-mono text-slate-400 font-semibold">{entry.agent}</span>
                            </div>
                          </div>

                          <div className="text-xs text-slate-300 font-medium sm:text-center flex-grow max-w-xl">
                            {entry.summary}
                          </div>

                          <div>
                            {isSkipped ? (
                              <span className="bg-amber-950/40 text-amber-500 border border-amber-900/60 rounded-full px-2.5 py-0.5 text-[10px] font-semibold font-mono">
                                ⏭️ Skipped
                              </span>
                            ) : (
                              <span className="bg-emerald-950 text-emerald-400 border border-emerald-900/60 rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                                ✅ Written
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Platform Architecture Highlights</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { title: '🔄 Dynamic Orchestration', desc: 'Planner agent decides execution steps based on configuration and incoming logs.' },
                        { title: '🧠 Shared Memory', desc: 'Shared context store preserves state across execution blocks, avoiding duplicate API calls.' },
                        { title: '🔌 Extensible Architecture', desc: 'Pluggable agent template. New nodes connect without code-level core refactoring.' },
                        { title: '👤 Human-in-the-Loop', desc: 'Outreach workflows stop for human review. Approval actions trigger delivery pipelines.' }
                      ].map(item => (
                        <div key={item.title} className="bg-slate-850/50 border border-slate-800 p-4 rounded-lg space-y-1">
                          <h5 className="text-xs font-bold text-slate-200">{item.title}</h5>
                          <p className="text-[11px] text-slate-500 leading-normal">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <button
                      onClick={() => setShowRawJson(!showRawJson)}
                      className="bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-300 font-mono text-xs px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all cursor-pointer"
                    >
                      <span>{showRawJson ? '▼' : '▶'}</span>
                      <span>{'{ }'} View Raw API Response</span>
                    </button>

                    {showRawJson && (
                      <div className="mt-3 bg-black border border-slate-800 rounded-lg p-4 overflow-x-auto max-h-96 text-left animate-fade-in font-mono text-xs text-emerald-400">
                        <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 7: PLATFORM ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-lg font-bold text-white">Pipeline Intelligence Report</h3>
                    <p className="text-xs text-slate-400">Analytics compiled from the latest orchestrated run results</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Score distribution */}
                    <div className="bg-slate-800 border border-slate-700/80 rounded-xl p-5 space-y-4">
                      <h4 className="text-sm font-bold text-slate-200 border-b border-slate-750 pb-2">Validation Score Distribution</h4>
                      
                      <div className="space-y-3.5">
                        {result.validation?.validated_companies?.map((c, index) => {
                          const isHigh = c.validation_score >= 90;
                          const isMed = c.validation_score >= 75;
                          
                          let barColor = 'bg-rose-500';
                          if (isHigh) barColor = 'bg-emerald-500';
                          else if (isMed) barColor = 'bg-orange-500';

                          return (
                            <div key={index} className="flex items-center text-xs">
                              <span className="w-1/4 font-semibold text-slate-300 truncate pr-2">{c.company}</span>
                              <div className="w-2/4 bg-slate-900 rounded-full h-3.5 overflow-hidden border border-slate-850">
                                <div 
                                  className={`h-full ${barColor} transition-all`} 
                                  style={{ width: `${c.validation_score}%` }}
                                ></div>
                              </div>
                              <span className="w-1/4 text-right font-mono font-bold text-slate-400 pl-2">
                                {c.validation_score} / 100
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Priority breakdown */}
                    <div className="bg-slate-800 border border-slate-700/80 rounded-xl p-5 space-y-4">
                      <h4 className="text-sm font-bold text-slate-200 border-b border-slate-750 pb-2">Action Priority Breakdown</h4>
                      
                      <div className="space-y-4">
                        {[
                          { label: 'Critical', count: isRecommendationsSkipped ? 0 : (result.recommendation?.recommendations?.filter(r => r.priority === 'Critical').length || 0), color: 'bg-rose-500' },
                          { label: 'High', count: isRecommendationsSkipped ? 0 : (result.recommendation?.recommendations?.filter(r => r.priority === 'High').length || 0), color: 'bg-orange-500' },
                          { label: 'Medium', count: isRecommendationsSkipped ? 0 : (result.recommendation?.recommendations?.filter(r => r.priority === 'Medium').length || 0), color: 'bg-amber-500' },
                          { label: 'Low', count: isRecommendationsSkipped ? 0 : (result.recommendation?.recommendations?.filter(r => r.priority === 'Low').length || 0), color: 'bg-slate-500' }
                        ].map((item) => {
                          const count = item.count;
                          const percent = totalRecs > 0 ? Math.round((count / totalRecs) * 100) : 0;
                          return (
                            <div key={item.label} className="space-y-1 text-xs">
                              <div className="flex justify-between items-center text-slate-400">
                                <span className="font-semibold text-slate-300">{item.label}</span>
                                <span className="font-mono">{count} ({isRecommendationsSkipped ? "0%" : `${percent}%`})</span>
                              </div>
                              <div className="bg-slate-900 h-2.5 w-full rounded-full overflow-hidden border border-slate-850">
                                {count > 0 ? (
                                  <div className={`h-full ${item.color}`} style={{ width: `${percent}%` }}></div>
                                ) : (
                                  <div className="text-[10px] text-slate-600 pl-2 italic leading-[10px] select-none">(none)</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Efficiency Metrics */}
                  <div className="bg-slate-800 border border-slate-700/80 rounded-xl p-5 space-y-4">
                    <h4 className="text-sm font-bold text-slate-200 border-b border-slate-750 pb-2">Pipeline Efficiency Metrics</h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                        <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">Processed Companies</span>
                        <span className="text-2xl font-extrabold text-white mt-1 block font-mono">{processedCompaniesCount}</span>
                      </div>
                      
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                        <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">ICP Match Rate</span>
                        <span className="text-2xl font-extrabold text-emerald-400 mt-1 block font-mono">{icpRate}%</span>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                        <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">Avg Validation Score</span>
                        <span className="text-2xl font-extrabold text-blue-400 mt-1 block font-mono">{avgValidationScore}/100</span>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                        <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">Human Approval Rate</span>
                        <span className="text-2xl font-extrabold text-purple-400 mt-1 block font-mono">
                          {isRecommendationsSkipped ? "0%" : `${approvalRate}%`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-850 border border-slate-800/80 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Run Reference Settings</h4>
                      <p className="text-[11px] text-slate-550 leading-relaxed">
                        Industry Vertical: <strong className="text-slate-400 font-semibold">{industry}</strong> · 
                        Trigger Event: <strong className="text-slate-400 font-semibold">{trigger}</strong> · 
                        Target personas: <strong className="text-slate-400 font-semibold">CISO, CTO, VP Engineering, Head of Security</strong>
                      </p>
                    </div>
                    <span className="bg-slate-900 text-slate-500 text-[10px] font-bold px-3 py-1 rounded border border-slate-800 uppercase font-mono tracking-wider">
                      Orchestration Completed
                    </span>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

        {/* Default intro state */}
        {!result && !loading && (
          <section className="bg-slate-800/35 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-2xl mx-auto animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl">
              ⚙️
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Pipeline Ready</h3>
              <p className="text-xs text-slate-450 leading-relaxed max-w-md">
                Configure your target parameters above and click <strong>Launch Agent Pipeline</strong> to trigger market discovery, lead scoring, and next-best-action modeling.
              </p>
            </div>
          </section>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950/80 py-8 px-6 text-center text-xs text-slate-550 space-y-2">
        <div>
          Opportunity Radar — XLVentures.AI Hackathon Submission
        </div>
        <div className="text-[10px] text-slate-600 font-medium">
          Agentic AI Platform · Multi-Agent Orchestration · Human-in-the-Loop
        </div>
        <div className="text-[10px] text-slate-650">
          Built with FastAPI · React · GNews API · Google Gemini
        </div>
      </footer>
    </div>
  );
}

export default App;
