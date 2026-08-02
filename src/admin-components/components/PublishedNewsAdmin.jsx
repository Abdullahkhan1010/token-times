import React, { useState, useEffect, useRef } from "react";
import { Newspaper, Plus, Trash2, FileText, CheckCircle2, AlertCircle, Archive, X, Upload, Sparkles, Pin, Star, Zap, Building2, Globe, BookOpen } from "lucide-react";
import { getPublishedNews, postPublishedNews, putPublishedNews, deletePublishedNews, archivePublishedNews } from "../../services/published-news.service";
import { uploadFileToS3 } from "../../services/file.service";
import { requestJson } from "../../services/api";
import PageHeader from "./PageHeader";

const DISPLAY_SECTIONS = [
    { value: "main_story", label: "Main Story", desc: "Hero top headline banner on homepage", icon: Newspaper },
    { value: "top_story", label: "Top Story", desc: "Prominent Top Story card on homepage hero", icon: Star },
    { value: "featured_spotlight", label: "Featured Spotlight", desc: "Highlighted center spotlight story", icon: Sparkles },
    { value: "sub_stories", label: "Substories", desc: "Supporting side stories grid", icon: Pin },
    { value: "editor_picks", label: "Editor's Pick", desc: "Curated executive editorial picks", icon: Star },
    { value: "latest_news", label: "Latest News", desc: "Real-time ticker and latest feed", icon: Zap },
    { value: "Pakistan_Focus", label: "Pakistan Focus", desc: "SBP, SECP & local regulatory intelligence", icon: Building2 },
    { value: "Global_Highlight", label: "Global Highlights", desc: "Macro Web3 & international market reports", icon: Globe },
    { value: "featured_analysis", label: "Featured Analysis", desc: "Deep-dive econometric research & whitepapers", icon: BookOpen },
];

export default function PublishedNewsAdmin({ draftData = null, onPublishComplete = null, onCancel = null }) {
    const imageInputRef = useRef(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [draftId, setDraftId] = useState(null);

    // Form fields
    const [title, setTitle] = useState("");
    const [article, setArticle] = useState("");
    const [summary, setSummary] = useState("");
    const [author, setAuthor] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [approxTimeToRead, setApproxTimeToRead] = useState("");
    const [categoryStr, setCategoryStr] = useState("");
    const [tagsStr, setTagsStr] = useState("");
    const [headlinesStr, setHeadlinesStr] = useState("");
    const [displaySections, setDisplaySections] = useState([]);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getPublishedNews();
            setItems(data);
        } catch (err) {
            console.error("Failed to load published news", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        // Populate form with draft data when provided
        if (draftData) {
            setDraftId(draftData.id || draftData._id);
            setTitle(draftData.title || "");
            setArticle(draftData.article || "");
            setSummary(draftData.summary || "");

            // Parse category array
            if (Array.isArray(draftData.category)) {
                const categories = draftData.category.map(c => c.name || c).filter(Boolean);
                setCategoryStr(categories.join(", "));
            }

            // Parse tags array
            if (Array.isArray(draftData.tags)) {
                const tags = draftData.tags.map(t => t.name || t).filter(Boolean);
                setTagsStr(tags.join(", "));
            }

            // Parse headlines array
            if (Array.isArray(draftData.headlines)) {
                const headlines = draftData.headlines.map(h => h.headline || h).filter(Boolean);
                setHeadlinesStr(headlines.join(", "));
            }
        }
    }, [draftData]);

    const handleDisplaySectionChange = (section) => {
        setDisplaySections((prev) =>
            prev.includes(section)
                ? prev.filter((s) => s !== section)
                : [...prev, section]
        );
    };

    const resetForm = () => {
        setTitle("");
        setArticle("");
        setSummary("");
        setAuthor("");
        setImageFile(null);
        setApproxTimeToRead("");
        setCategoryStr("");
        setTagsStr("");
        setHeadlinesStr("");
        setDisplaySections([]);
        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !article || !summary || !author) {
            setMessage({ type: "error", text: "Please fill all required fields." });
            return;
        }
        setSubmitting(true);
        setMessage(null);

        if (!imageFile) {
            setMessage({ type: "error", text: "Please select an image." });
            setSubmitting(false);
            return;
        }

        try {
            const imageUpload = await uploadFileToS3(imageFile);

            const categoryArr = categoryStr.split(",").map((c) => c.trim()).filter(Boolean);
            const tagsArr = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);
            const headlinesArr = headlinesStr.split(",").map((h) => h.trim()).filter(Boolean);

            await postPublishedNews({
                title,
                article,
                summary,
                author,
                image: imageUpload.fileKey,
                approx_time_to_read: parseInt(approxTimeToRead) || 0,
                category: categoryArr,
                tags: tagsArr,
                headlines: headlinesArr,
                display_section: displaySections,
            });

            // If this was from a draft, delete the draft
            if (draftId) {
                try {
                    await requestJson(`/news/drafts/${draftId}`, { method: 'DELETE' });
                } catch (draftErr) {
                    console.error('Failed to delete draft:', draftErr);
                }
            }

            setMessage({ type: "success", text: "Published news created successfully!" });
            resetForm();
            setDraftId(null);

            // If onPublishComplete callback is provided, call it (for draft workflow)
            if (onPublishComplete) {
                setTimeout(() => onPublishComplete(), 500);
            } else {
                await loadData();
            }
        } catch (err) {
            setMessage({ type: "error", text: err.message || "Failed to create published news." });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this published news?")) return;
        try {
            await deletePublishedNews(id);
            setItems((prev) => prev.filter((item) => (item.id || item._id) !== id));
            setMessage({ type: "success", text: "Published news deleted." });
        } catch (err) {
            setMessage({ type: "error", text: "Failed to delete published news." });
        }
    };

    const handleArchive = async (id) => {
        if (!window.confirm("Are you sure you want to archive this published news?")) return;
        try {
            await archivePublishedNews(id);
            await loadData();
            setMessage({ type: "success", text: "Published news archived." });
        } catch (err) {
            setMessage({ type: "error", text: "Failed to archive published news." });
        }
    };

    const handleSeedSampleArticles = async () => {
        if (!window.confirm("Inject sample test articles into database for all categories and sections?")) return;
        setSubmitting(true);
        setMessage({ type: "info", text: "Injecting sample test articles..." });

        try {
            const sampleArticles = [
                {
                    title: "State Bank of Pakistan Outlines Phase-1 Framework for Wholesale CBDC",
                    summary: "The State Bank of Pakistan unveils structural directives for institutional CBDC settlement engines, aiming to streamline cross-border interbank clearings and reduce remittance friction.",
                    article: "The State Bank of Pakistan (SBP) has officially published its phase-1 technical whitepaper outlining the architectural roadmap for a wholesale Central Bank Digital Currency (CBDC).\n\nKey monetary objectives include establishing programmable interbank clearing corridors, reducing cross-border correspondent banking latency, and integrating automated compliance verifications directly at the ledger level.\n\nInstitutional market participants, commercial banks, and licensed payment service providers will participate in closed-loop pilot clearing runs beginning Q3 2026.",
                    author: "Monetary Policy Desk",
                    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop",
                    approx_time_to_read: 5,
                    category: ["Regulation", "Policy"],
                    tags: ["CBDC", "SBP", "Banking"],
                    headlines: ["SBP Wholesale CBDC Blueprint Released", "Phase-1 Interbank Clearance Pilot Scheduled"],
                    display_section: ["main_story"],
                    status: "published"
                },
                {
                    title: "SECP Formulates Sandbox Guidelines for Digital Asset Exchanges",
                    summary: "Securities regulator issues comprehensive operational rules governing licensed VASP platforms, custody reserves, and investor protection safeguards.",
                    article: "The Securities and Exchange Commission of Pakistan (SECP) has released its sandbox regulatory guidelines for digital asset trading platforms.\n\nThe framework establishes strict capital adequacy requirements, mandatory cold-storage asset isolation, and real-time transaction monitoring to ensure compliance with FATF AML standards.",
                    author: "Regulatory Affairs Desk",
                    image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800&auto=format&fit=crop",
                    approx_time_to_read: 4,
                    category: ["Regulation"],
                    tags: ["SECP", "VASP", "Sandbox"],
                    display_section: ["sub_stories"],
                    status: "published"
                },
                {
                    title: "PSX Tests Tokenized Commercial Paper on DLT Settlement Corridor",
                    summary: "Pakistan Stock Exchange conducts successfully automated issuance and settlement of short-term debt instruments on enterprise blockchain.",
                    article: "In a landmark pilot, the Pakistan Stock Exchange (PSX) executed the trial settlement of tokenized commercial paper.\n\nThe pilot demonstrated 90% reduction in clearing settlement settlement times from T+2 to real-time T+0, lowering counterparty risk for institutional fixed-income participants.",
                    author: "Capital Markets Desk",
                    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
                    approx_time_to_read: 3,
                    category: ["Markets"],
                    tags: ["PSX", "Tokenization", "DLT"],
                    display_section: ["sub_stories"],
                    status: "published"
                },
                {
                    title: "GCC Monetary Authorities Sign Multi-Currency Settlement Agreement",
                    summary: "Central monetary bodies across Middle Eastern financial corridors harmonize cross-border DLT payment channels.",
                    article: "Monetary authorities across the GCC have ratified a multi-lateral agreement to interconnect sovereign wholesale payment rails.\n\nThe initiative enables instantaneous multi-currency clearing between commercial banks in Dubai, Riyadh, and regional trading partners.",
                    author: "Global Markets Desk",
                    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop",
                    approx_time_to_read: 4,
                    category: ["Global"],
                    tags: ["GCC", "Payments", "Cross-Border"],
                    display_section: ["sub_stories"],
                    status: "published"
                },
                {
                    title: "Institutional Custody Providers Expand Multi-Sig Vault Infrastructure",
                    summary: "Enterprise digital asset custodians launch HSM-secured multi-signature vaults in regional data centers.",
                    article: "Leading digital asset custody infrastructure providers have deployed high-availability Hardware Security Module (HSM) vaults across primary regional financial hubs.",
                    author: "Technology Desk",
                    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
                    approx_time_to_read: 3,
                    category: ["Technology"],
                    tags: ["Custody", "Security", "HSM"],
                    display_section: ["sub_stories"],
                    status: "published"
                },
                {
                    title: "Fractional Real Estate Tokenization Unlocks Regional Asset Liquidity",
                    summary: "High-value commercial property developments offer fractional digital ownership tokens to accredited regional investors.",
                    article: "Institutional property developers have launched the first tokenized real estate offering, enabling fractional investment in prime commercial towers.",
                    author: "Special Features Desk",
                    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
                    approx_time_to_read: 5,
                    category: ["Markets", "Real Estate"],
                    tags: ["RWA", "Tokenization", "Real Estate"],
                    display_section: ["featured_spotlight"],
                    status: "published"
                },
                {
                    title: "Zero-Knowledge Proof Protocols Adopted for Sovereign Tax Compliance",
                    summary: "Privacy-preserving cryptographic proofs enable automated tax reporting without exposing sensitive individual wallet transactions.",
                    article: "Sovereign revenue authorities are piloting zero-knowledge proof (ZKP) compliance engines that allow virtual asset holders to verify tax obligations while maintaining cryptographic privacy.",
                    author: "Tech & Tax Desk",
                    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
                    approx_time_to_read: 4,
                    category: ["Technology"],
                    tags: ["ZKP", "Privacy", "Tax"],
                    display_section: ["featured_spotlight"],
                    status: "published"
                },
                {
                    title: "Macro Analysis: Sovereign Debt Tokenization in Emerging Financial Hubs",
                    summary: "Evaluating how sovereign debt issuance on public-permissioned ledgers reduces underwriting fees and expands international investor access.",
                    article: "An extensive macroeconometric study highlights how emerging markets can lower sovereign bond issuance overhead by leveraging tokenized debt standards.",
                    author: "Dr. Arshad Khan",
                    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop",
                    approx_time_to_read: 6,
                    category: ["Analysis", "Markets"],
                    tags: ["Macro", "Sovereign Debt", "Bonds"],
                    display_section: ["editor_picks"],
                    status: "published"
                },
                {
                    title: "How Asia-Pacific Central Banks Balance Web3 Innovation with Capital Controls",
                    summary: "A comparative review of regulatory approaches across Singapore, Japan, Hong Kong, and South Asia.",
                    article: "Central monetary bodies across the Asia-Pacific region are adopting distinct frameworks to manage capital flow volatility while supporting Web3 infrastructure development.",
                    author: "T.T. Policy Research Unit",
                    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
                    approx_time_to_read: 5,
                    category: ["Policy"],
                    tags: ["APAC", "Policy", "Regulation"],
                    display_section: ["editor_picks"],
                    status: "published"
                },
                {
                    title: "The Rise of Institutional Staking and Yield Derivatives in 2026",
                    summary: "Asset managers allocate record capital into regulated proof-of-stake yield protocols and liquid staking derivatives.",
                    article: "Institutional treasury managers are increasingly tapping proof-of-stake yield strategies through regulated custody providers.",
                    author: "DeFi Desk",
                    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=800&auto=format&fit=crop",
                    approx_time_to_read: 4,
                    category: ["DeFi"],
                    tags: ["Staking", "Yield", "DeFi"],
                    display_section: ["editor_picks"],
                    status: "published"
                },
                {
                    title: "Global Crypto Trading Volumes Surge Past $120 Billion Daily Milestone",
                    summary: "Derivative desks and spot liquidity pools experience elevated volume driven by institutional inflow products.",
                    article: "Daily aggregate trading volumes across licensed spot and derivative venues breached the $120 billion threshold today.",
                    author: "Market Ticker",
                    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
                    approx_time_to_read: 3,
                    category: ["Markets"],
                    tags: ["Volume", "Trading", "Liquidity"],
                    display_section: ["latest_news"],
                    status: "published"
                },
                {
                    title: "European Union MiCA Regime Completes Phase 2 VASP Compliance Audit",
                    summary: "ESMA publishes initial audit results for licensed stablecoin issuers and virtual asset service providers under MiCA rules.",
                    article: "The European Securities and Markets Authority (ESMA) confirmed that 85% of major stablecoin issuers have fulfilled MiCA reserve backing criteria.",
                    author: "European Desk",
                    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop",
                    approx_time_to_read: 4,
                    category: ["Regulation"],
                    tags: ["MiCA", "EU", "ESMA"],
                    display_section: ["latest_news"],
                    status: "published"
                },
                {
                    title: "U.S. Spot Bitcoin ETFs Record $450 Million Single-Day Inflow Stream",
                    summary: "Institutional momentum accelerates as asset management products see continuous net inflows.",
                    article: "U.S. regulated spot exchange-traded funds recorded $450 million in aggregate net inflows during yesterday's trading session.",
                    author: "ETF Desk",
                    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
                    approx_time_to_read: 3,
                    category: ["Markets"],
                    tags: ["ETF", "Bitcoin", "Inflows"],
                    display_section: ["latest_news"],
                    status: "published"
                },
                {
                    title: "Ministry of IT and Telecom Proposes Digital Asset Tax Exemption Corridor",
                    summary: "Policy paper recommends tax incentives for registered Web3 software exporters and blockchain R&D centers.",
                    article: "The Ministry of IT and Telecommunication has submitted a draft policy recommending a 3-year tax exemption for verified Web3 export revenues.",
                    author: "Pakistan Tech Desk",
                    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
                    approx_time_to_read: 4,
                    category: ["Policy"],
                    tags: ["MOITT", "Pakistan", "Tax"],
                    display_section: ["Pakistan_Focus"],
                    status: "published"
                },
                {
                    title: "Commercial Banks Partner with Local Exchanges for Real-Time Fiat Onramps",
                    summary: "Leading Pakistani commercial banking institutions integrate API gateways for 1-click fiat deposits.",
                    article: "Major commercial banks have initiated API connectivity with licensed virtual asset portals to enable instant 24/7 Raast and IBFT fiat deposits.",
                    author: "Banking Desk",
                    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop",
                    approx_time_to_read: 3,
                    category: ["Banking"],
                    tags: ["Banking", "Fiat", "Raast"],
                    display_section: ["Pakistan_Focus"],
                    status: "published"
                },
                {
                    title: "Dubai VARA Grants Full Operational License to Institutional Custodian",
                    summary: "Virtual Assets Regulatory Authority approves new tier-1 custodian for institutional digital asset reserves.",
                    article: "Dubai VARA has granted full commercial operating authorization to a leading institutional custodian following rigorous audit rounds.",
                    author: "Middle East Desk",
                    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop",
                    approx_time_to_read: 4,
                    category: ["Middle East"],
                    tags: ["VARA", "Dubai", "License"],
                    display_section: ["Global_Highlight"],
                    status: "published"
                },
                {
                    title: "Japan Financial Services Agency Approves First Sovereign Yield Token",
                    summary: "FSA establishes regulatory permissions for institutional distribution of tokenized government bond yields.",
                    article: "Japan's FSA has granted approval for the issuance of tokenized government bond yields on regulated public ledgers.",
                    author: "Asia-Pacific Desk",
                    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
                    approx_time_to_read: 4,
                    category: ["Asia Pacific"],
                    tags: ["Japan", "FSA", "Yield"],
                    display_section: ["Global_Highlight"],
                    status: "published"
                },
                {
                    title: "Econometric Deep-Dive: Valuation Models for Tokenized Real-World Assets",
                    summary: "Detailed academic and financial modeling analyzing liquidity discounts and yield curves across tokenized treasuries.",
                    article: "This research paper evaluates discount models applied to tokenized real-world assets (RWA) compared with secondary bond market benchmarks.",
                    author: "T.T. Quantitative Research Desk",
                    image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=800&auto=format&fit=crop",
                    approx_time_to_read: 8,
                    category: ["Research"],
                    tags: ["Econometrics", "RWA", "Valuation"],
                    display_section: ["featured_analysis"],
                    status: "published"
                }
            ];

            for (const item of sampleArticles) {
                await postPublishedNews(item);
            }

            // Seed Regulations
            const sampleRegulations = [
                { title: "SBP Circular No. 4: CBDC Phase-1 Framework Directives", country: "Pakistan", date: "2026-08-01", status: "Active Directives", details: "State Bank guidelines on wholesale CBDC clearing." },
                { title: "SECP VASP Sandbox Operating Rules v2.0", country: "Pakistan", date: "2026-07-28", status: "Sandbox Guidelines", details: "Custody reserve and AML compliance requirements." },
                { title: "FBR 15% Flat Capital Gains Tax Consultation", country: "Pakistan", date: "2026-07-25", status: "Under Review", details: "Tax framework for virtual asset capital gains." },
                { title: "VARA Dubai - Asset-Backed Tokenization Directives", country: "UAE", date: "2026-07-20", status: "Enacted", details: "Licensing framework for real-world asset tokens." },
                { title: "EU MiCA Travel Rule Compliance Protocol v2.1", country: "EU", date: "2026-07-15", status: "Enacted", details: "Inter-VASP transaction data reporting requirements." }
            ];
            for (const reg of sampleRegulations) {
                try { await requestJson('/regulations', { method: 'POST', body: JSON.stringify(reg) }); } catch (e) {}
            }

            // Seed Columnists / Op-Eds
            const sampleInterviews = [
                {
                    interview_title: "Why Regulation is Not the Enemy of Web3 Innovation",
                    interviewee_name: "Dr. Arshad Khan",
                    interviewee_designation: "Senior Monetary Economist",
                    interviewee_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
                    summary: "Clear legal frameworks provide the institutional certainty required for multi-billion dollar capital allocations into digital asset infrastructure."
                },
                {
                    interview_title: "Building Enterprise Blockchain Corridors Across South Asia",
                    interviewee_name: "Tariq Mansoor",
                    interviewee_designation: "VASP Association Director",
                    interviewee_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
                    summary: "How public-private distributed ledger initiatives are reducing remittance costs and expanding regional cross-border commerce."
                }
            ];
            for (const iv of sampleInterviews) {
                try { await requestJson('/interviews', { method: 'POST', body: JSON.stringify(iv) }); } catch (e) {}
            }

            // Seed Events
            const sampleEvents = [
                {
                    event_title: "Pakistan Web3 & Digital Asset Summit 2026",
                    event_date: "2026-08-15",
                    event_venue: "Serena Hotel, Islamabad",
                    description: "Annual gathering of central bank governors, SECP leadership, and global Web3 founders."
                },
                {
                    event_title: "Middle East VASP Regulatory Roundtable",
                    event_date: "2026-09-02",
                    event_venue: "DIFC Innovation Hub, Dubai",
                    description: "Closed-door executive consultation on cross-border virtual asset licensing."
                }
            ];
            for (const ev of sampleEvents) {
                try { await requestJson('/events', { method: 'POST', body: JSON.stringify(ev) }); } catch (e) {}
            }

            // Seed Research Papers
            const sampleResearches = [
                {
                    title: "Sovereign Asset Digitization: Institutional Capital Flows & Security",
                    author: "T.T. Quantitative Research Desk",
                    publish_date: "2026-08-01",
                    summary: "Evaluating fractional ownership liquidity and collateralized yield protocols."
                },
                {
                    title: "Cross-Border Interbank Settlement Mechanics Using Distributed Ledgers",
                    author: "Monetary Policy Study Group",
                    publish_date: "2026-07-28",
                    summary: "Architectural comparison of wholesale CBDC clearing networks versus traditional SWIFT corridors."
                }
            ];
            for (const res of sampleResearches) {
                try { await requestJson('/researches', { method: 'POST', body: JSON.stringify(res) }); } catch (e) {}
            }

            setMessage({ type: "success", text: "Successfully injected sample test articles for all categories & sections!" });
            await loadData();
        } catch (err) {
            console.error("Failed to seed sample articles", err);
            setMessage({ type: "error", text: "Failed to seed sample test articles: " + (err.message || "") });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="Published News Management"
                subtitle="Create and manage published news articles for the platform."
                message={message}
                onDismissMessage={() => setMessage(null)}
            >
                <button
                    type="button"
                    onClick={handleSeedSampleArticles}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#0C133D] font-extrabold text-xs rounded-lg hover:bg-[#b8972e] transition-all shadow-sm cursor-pointer border border-[#0C133D]/20"
                >
                    <Sparkles size={16} />
                    Inject Sample Test Articles
                </button>
            </PageHeader>

            {/* Add New Form */}
            <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                    <Plus size={18} className="text-accent" /> {draftId ? "Publish News from Draft" : "Add Published News"}
                </h3>
                {draftId && (
                    <p className="text-xs text-on-surface-variant bg-accent/10 border border-accent/20 rounded px-3 py-2">
                        Editing draft: Fill in the remaining fields and click "Publish News" to publish this article.
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Title *</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. New Digital Asset Policy Announced"
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                    </div>

                    {/* Summary */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Summary *</label>
                        <textarea
                            rows={2}
                            required
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="Brief summary of the article..."
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                    </div>

                    {/* Article */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Article *</label>
                        <textarea
                            rows={6}
                            required
                            value={article}
                            onChange={(e) => setArticle(e.target.value)}
                            placeholder="Full article content..."
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                    </div>

                    {/* Author */}
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Author *</label>
                        <input
                            type="text"
                            required
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="e.g. John Doe"
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                    </div>

                    {/* Approx Time to Read */}
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Approx. Time to Read (minutes)</label>
                        <input
                            type="number"
                            min="0"
                            value={approxTimeToRead}
                            onChange={(e) => setApproxTimeToRead(e.target.value)}
                            placeholder="e.g. 5"
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                            Article Cover Image <span className="text-rose-500">*</span>
                        </label>

                        <div
                            onClick={() => imageInputRef.current?.click()}
                            className="border-2 border-dashed border-outline-variant rounded-xl p-4 text-center bg-surface-bright hover:bg-surface-container-low hover:border-[#D4AF37] transition-all cursor-pointer group"
                        >
                            <input
                                type="file"
                                ref={imageInputRef}
                                accept="image/*"
                                required
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                className="hidden"
                            />
                            {imageFile ? (
                                <div className="py-2 flex items-center justify-center gap-3 text-xs font-bold text-[#0C133D]">
                                    <FileText size={20} className="text-[#D4AF37]" />
                                    <span>{imageFile.name}</span>
                                    <span className="text-[10px] uppercase font-bold text-[#D4AF37] ml-2">Change Image</span>
                                </div>
                            ) : (
                                <div className="py-3 flex flex-col items-center gap-1.5">
                                    <Upload size={24} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold text-[#0C133D]">Click to upload Article Cover Image</span>
                                    <span className="text-[11px] text-on-surface-variant">PNG, JPG, WebP up to 5MB</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Category (comma-separated)</label>
                        <input
                            type="text"
                            value={categoryStr}
                            onChange={(e) => setCategoryStr(e.target.value)}
                            placeholder="e.g. Finance, Technology, Policy"
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Tags (comma-separated)</label>
                        <input
                            type="text"
                            value={tagsStr}
                            onChange={(e) => setTagsStr(e.target.value)}
                            placeholder="e.g. Bitcoin, Blockchain, Regulation"
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                    </div>

                    {/* Headlines */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Headlines (comma-separated)</label>
                        <input
                            type="text"
                            value={headlinesStr}
                            onChange={(e) => setHeadlinesStr(e.target.value)}
                            placeholder="e.g. Breaking News, Market Update"
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                    </div>

                    {/* Display Section Selection Grid - Matching Create Article Studio */}
                    <div className="md:col-span-2 space-y-3">
                        <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                Section Tag Categories (Select Placement)
                            </label>
                            <span className="text-xs font-semibold text-[#D4AF37] bg-[#0C133D] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                                {displaySections.length} Selected
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                            {DISPLAY_SECTIONS.map((section) => {
                                const isSelected = displaySections.includes(section.value);
                                const SectionIcon = section.icon;
                                return (
                                    <button
                                        type="button"
                                        key={section.value}
                                        onClick={() => handleDisplaySectionChange(section.value)}
                                        className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                                            isSelected
                                                ? "bg-[#0C133D] text-white border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/40"
                                                : "bg-surface-bright text-on-surface border-outline-variant hover:border-[#D4AF37]/60 hover:bg-surface-container-low"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <SectionIcon size={18} className={isSelected ? "text-[#D4AF37]" : "text-[#0C133D]"} />
                                            <span
                                                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                                    isSelected
                                                        ? "bg-[#D4AF37] border-[#D4AF37] text-[#0C133D]"
                                                        : "border-outline-variant"
                                                }`}
                                            >
                                                {isSelected && <CheckCircle2 size={12} strokeWidth={3} />}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className={`text-xs font-extrabold uppercase tracking-wider mb-1 ${isSelected ? "text-[#D4AF37]" : "text-[#0C133D]"}`}>
                                                {section.label}
                                            </h3>
                                            <p className={`text-[10px] leading-snug line-clamp-2 ${isSelected ? "text-slate-300" : "text-on-surface-variant"}`}>
                                                {section.desc}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    {draftId && onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={submitting}
                            className="px-5 py-2.5 bg-surface-container-low text-on-surface border border-outline-variant font-label-caps text-xs font-bold rounded hover:bg-surface-container-high transition-opacity disabled:opacity-50 flex items-center gap-2"
                        >
                            <X size={16} />
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2.5 bg-primary text-on-primary font-label-caps text-xs font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {submitting ? "Saving..." : (draftId ? "Publish News" : "Create Published News")}
                    </button>
                </div>
            </form>

            {/* Published News List */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm space-y-4 p-6">
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                    <FileText size={18} className="text-accent" /> Published News ({items.length})
                </h3>

                {loading ? (
                    <p className="text-xs text-on-surface-variant py-4">Loading published news...</p>
                ) : items.length === 0 ? (
                    <p className="text-xs text-on-surface-variant py-4">No published news added yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-outline-variant bg-surface-container-low text-on-surface-variant font-label-caps uppercase">
                                    <th className="py-2.5 px-3">Title</th>
                                    <th className="py-2.5 px-3">Author</th>
                                    <th className="py-2.5 px-3">Read Time</th>
                                    <th className="py-2.5 px-3">Views</th>
                                    <th className="py-2.5 px-3">Status</th>
                                    <th className="py-2.5 px-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/40">
                                {items.map((item) => (
                                    <tr key={item._id} className="hover:bg-surface-container-low/50">
                                        <td className="py-3 px-3 font-semibold text-on-surface max-w-xs truncate">
                                            {item.title}
                                        </td>
                                        <td className="py-3 px-3 text-on-surface-variant">{item.author}</td>
                                        <td className="py-3 px-3 text-on-surface-variant font-data-tabular">
                                            {item.approx_time_to_read} min
                                        </td>
                                        <td className="py-3 px-3 text-on-surface-variant font-data-tabular">
                                            {item.view_count}
                                        </td>
                                        <td className="py-3 px-3">
                                            <span
                                                className={`px-2 py-1 rounded text-[10px] font-semibold ${item.status === "archived"
                                                    ? "bg-gray-500/10 text-gray-700"
                                                    : "bg-green-500/10 text-green-700"
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {item.status !== "archived" && (
                                                    <button
                                                        onClick={() => handleArchive(item.id || item._id)}
                                                        className="text-orange-500 hover:text-orange-700 p-1 rounded"
                                                        title="Archive"
                                                    >
                                                        <Archive size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(item.id || item._id)}
                                                    className="text-red-500 hover:text-red-700 p-1 rounded"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
