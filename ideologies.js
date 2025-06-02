const ideologies = [
    {
        "name": "Fusion Party Alignment",
        "description": "This profile reflects a strong alignment with the Fusion Party's core values and their balanced, evidence-based approach to policy.",
        "stats": {
            "liberty": 90,
            "advancement": 95,
            "harmony": 95,
            "safety": 85,
            "ethics": 100,
            "equity": 90
        }
    },
    {
        "name": "Liberty-Focused Innovator",
        "description": "Prioritizes individual freedom and technological progress, sometimes with less emphasis on collective safety nets or environmental regulation unless directly liberty-enhancing.",
        "stats": {
            "liberty": 95,
            "advancement": 90,
            "harmony": 40,
            "safety": 30,
            "ethics": 70, 
            "equity": 40
        }
    },
    {
        "name": "Eco-Centric Guardian",
        "description": "Places paramount importance on ecological protection and natural balance, sometimes advocating for limits on technological advancement or individual consumption for environmental purity.",
        "stats": {
            "liberty": 40, // Liberty restricted for ecological goals
            "advancement": 25, // Skeptical of tech as a solution
            "harmony": 100,
            "safety": 65, // Safety from eco-collapse, but individual safety might be lower due to restrictions
            "ethics": 70, // Ethical imperative to protect nature
            "equity": 50  // Equity in austerity, perhaps
        }
    },
    {
        "name": "Order & Stability Advocate",
        "description": "Values societal safety, order, and strong governance above most other concerns, potentially accepting limits on personal freedoms or rapid progress for stability.",
        "stats": {
            "liberty": 30,
            "advancement": 50,
            "harmony": 50,
            "safety": 95,
            "ethics": 75, 
            "equity": 50
        }
    },
    {
        "name": "Market-Driven Individualist",
        "description": "Strongly emphasizes economic freedoms and market-based solutions, with less focus on state-led ecological, safety, or equity interventions.",
        "stats": {
            "liberty": 90,      // High on economic liberty specifically
            "advancement": 70,
            "harmony": 20,      // Externalities largely ignored
            "safety": 25,       // Minimal state safety net
            "ethics": 40,       // "Market ethics" can differ
            "equity": 20        // Market outcomes are definitionally fair
        }
    },
    {
        "name": "Community Solidarity Advocate",
        "description": "Focuses on strong social safety nets, community well-being, and equitable distribution of resources, sometimes prioritizing collective needs over individual liberties or rapid technological advancement.",
        "stats": {
            "liberty": 60,
            "advancement": 60,
            "harmony": 70,
            "safety": 90,
            "ethics": 80,
            "equity": 95
        }
    },
    {
        "name": "Ethical Governance Purist",
        "description": "Places the highest importance on transparency, accountability, and evidence-based decision-making in government, viewing these as prerequisites for all other positive outcomes.",
        "stats": {
            "liberty": 70,
            "advancement": 75, 
            "harmony": 70,     
            "safety": 70,      
            "ethics": 100,
            "equity": 75      
        }
    },
    // --- NEW CONTRASTING ARCHETYPES ---
    {
        "name": "Traditional Community Guardian",
        "description": "Emphasizes established social norms, community cohesion based on tradition, and cautious approaches to change, valuing order derived from shared heritage.",
        "stats": {
            "liberty": 40,     // Individual liberty secondary to community norms
            "advancement": 20, // Skeptical of progress that disrupts tradition
            "harmony": 50,     // Environmentalism if it aligns with traditional stewardship, not radical change
            "safety": 80,      // Safety through social order and known structures
            "ethics": 60,      // Ethics based on traditional moral codes
            "equity": 30       // Equity within traditional roles, less focus on systemic change for outsiders
        }
    },
    {
        "name": "Extreme Laissez-Faire Capitalist",
        "description": "Advocates for minimal to no government intervention in the economy or personal lives, believing markets and individual contracts are sufficient for societal organization.",
        "stats": {
            "liberty": 100,    // Primarily economic and negative liberty
            "advancement": 60, // Only market-driven, no public R&D
            "harmony": 10,     // No value for environmental protection beyond property rights
            "safety": 10,      // No public safety net, private security
            "ethics": 20,      // Contractual ethics, caveat emptor
            "equity": 5        // Market outcomes are just, regardless of disparity
        }
    },
    {
        "name": "Authoritarian Nationalist",
        "description": "Prioritizes national strength, unity, and security above all, often at the expense of individual liberties, international cooperation, and minority rights.",
        "stats": {
            "liberty": 10,     // Individual liberties suppressed for national unity/security
            "advancement": 40, // Advancement only if it serves national power
            "harmony": 25,     // Environment sacrificed for national industry/resources
            "safety": 90,      // National security and internal order (for the 'in-group') paramount
            "ethics": 15,      // "National interest" or leader's will defines ethics; low transparency
            "equity": 10       // Equity only for the dominant national group; minorities/outsiders excluded
        }
    },
    {
        "name": "Deep Green De-Growther", // More extreme than Eco-Centric Guardian
        "description": "Believes human society must drastically reduce its population, consumption, and technological footprint to achieve true ecological sustainability, even if it means sacrificing modern living standards.",
        "stats": {
            "liberty": 20,     // Significant restrictions on personal consumption/choices for the environment
            "advancement": 5,  // Views most modern technology as inherently harmful or unsustainable
            "harmony": 100,    // Absolute priority, nature over human desires
            "safety": 50,      // Safety from ecological collapse, but potential deprivation from de-growth
            "ethics": 60,      // Strong moral imperative for ecological preservation above all
            "equity": 40       // Equity in shared austerity/simple living
        }
    },
    {
        "name": "Theocratic Moralist", // Stronger than Social Conservative
        "description": "Advocates for society and laws to be strictly governed by specific religious doctrines and moral codes, with little tolerance for deviation.",
        "stats": {
            "liberty": 15,     // Personal liberty heavily restricted by religious law/moral code
            "advancement": 20, // Advancement rejected if it contradicts religious teachings or traditional morality
            "harmony": 40,     // Environment stewardship if dictated by religion, otherwise secondary
            "safety": 85,      // Safety through strict moral order and adherence to religious law
            "ethics": 70,      // Ethics are divinely ordained and immutable
            "equity": 25       // Equity defined by religious status or adherence; outsiders may not be equal
        }
    }
];
