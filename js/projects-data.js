/* projects-data.js — curated flagship case studies.
   kind: 'client' = delivered client project, 'build' = demo build.
   slug: used by case-study.html?p=<slug>.
   Thumbnail: video+poster, previewClass(+projectFile), or flow (workflow diagram).
   caseStudy: clientBrief, plan[], whatWasBuilt, steps[{title,detail}], bottleneck{title,detail}, fix, results[], feedback (reviewer name from reviews-data.js).
   services: which service pages list the project (claude-code, n8n, make, zapier, ai-website, openclaw, gohighlevel). */
window.PROJECTS = [
  {
    "title": "Lukonix — AI Product Image Generator",
    "kind": "client",
    "cat": "ai-development",
    "catLabel": "Custom AI Tool",
    "problem": "Producing on-brand product visuals for a robotic window cleaner took manual design work for every single image.",
    "desc": "A Claude Code web application that reads product specs and generates consistent, on-brand product imagery on demand.",
    "result": "Manual design time cut by over 80%",
    "video": "assets/videos/claude-code-demo.mp4",
    "preview": "assets/videos/claude-code-demo-preview.mp4",
    "poster": "assets/images/posters/claude-code-demo.jpg",
    "stack": [
      "Claude Code",
      "JavaScript",
      "REST API"
    ],
    "services": [
      "claude-code",
      "ai-website"
    ],
    "link": "claude-code.html",
    "caseStudy": {
      "clientBrief": "Lukonix sells a robotic window cleaner and needed a constant flow of social media creatives. Every post meant briefing a designer, waiting, and paying for manual work — for images that all followed the same brand rules anyway. They came to me wanting their marketing team to produce on-brand visuals themselves, straight from the product specs.",
      "whatWasBuilt": "A web application built with Claude Code that interprets product specifications and outputs consistent, professional visuals, keeping every image on-brand without a designer in the loop.",
      "results": [
        "Manual design time cut by over 80%",
        "On-brand visuals generated in about 30 seconds each",
        "Marketing team produces batch creatives without a designer"
      ],
      "plan": [
        "A simple web app the marketing team can use with zero design skills",
        "Claude turns product specs (plus an optional custom headline) into on-brand copy and feature highlights",
        "Ready-made layouts for Instagram (1080×1350) and Facebook (1200×630)",
        "One-click download, hosted online so anyone on the team can use it from a browser"
      ],
      "steps": [
        {
          "title": "Capture the brand",
          "detail": "Turned Lukonix's colours, typography, product photography and tone into a reusable template and prompt rules, so every output starts from the same brand system."
        },
        {
          "title": "Build the generation engine",
          "detail": "Claude reads the product specs and writes the headline and four feature highlights (safety, time savings, smart technology, results) in the brand's voice."
        },
        {
          "title": "Render per format",
          "detail": "Each piece of copy is placed into format-specific layouts for Instagram and Facebook, with the product image composited in."
        },
        {
          "title": "Ship it",
          "detail": "Added a 'Generate posts' flow with one-click downloads and deployed the app so the team can run it any time."
        }
      ],
      "bottleneck": {
        "title": "Long headlines broke the layouts",
        "detail": "Some generated or typed headlines were too long for the smaller formats, pushing text off the design or over the product image."
      },
      "fix": "I capped the custom headline field (with a live 0/60 character counter) and constrained Claude's output length per format, so the copy always fits the layout it's going into — no manual fixing afterwards.",
      "feedback": "Leo M."
    },
    "slug": "lukonix-ai-product-image-generator"
  },
  {
    "title": "Vote Obby — Round-Based Roblox Game",
    "kind": "client",
    "cat": "game-development",
    "catLabel": "Roblox Game",
    "problem": "The client wanted a Roblox obby that runs itself: players pick the difficulty together, race the course against the clock, then go back and vote again, with nobody starting rounds by hand.",
    "desc": "A complete round-based obby built in Roblox Studio: live difficulty voting, three courses, a round timer, checkpoints and moving laser obstacles, all scripted in Luau.",
    "result": "Rounds run hands-free, from vote to finish line",
    "video": "assets/videos/roblox-vote-obby.mp4",
    "preview": "assets/videos/roblox-vote-obby-preview.mp4",
    "poster": "assets/images/posters/roblox-vote-obby.jpg",
    "stack": [
      "Roblox Studio",
      "Luau",
      "RemoteEvents"
    ],
    "services": [],
    "caseStudy": {
      "clientBrief": "The client wanted a Roblox obby where the players decide what happens next. Between rounds everyone votes on the difficulty, the winning course starts automatically, and the round ends on a timer before sending everyone back to the lobby to vote again. It had to run on its own, with no one in the server starting rounds by hand, and it had to feel fair: no deaths that didn't make sense and no being sent back to the start for nothing.",
      "plan": [
        "A lobby with a live vote between Easy, Medium and Hard, with the count visible to everyone",
        "A server-side game loop: intermission → starting → playing → round over, on repeat",
        "Three courses with checkpoints, a round timer and a finish line that records each player's time",
        "Moving laser obstacles that look smooth for every player and kill reliably",
        "All interface built in code, so it is easy to change later"
      ],
      "whatWasBuilt": "Five scripts work together: GameManager runs the rounds on the server, VoteGui draws the voting and round screens, ObstacleAnimator and its client script move the lasers, and CheckpointService handles checkpoints, deaths and respawns.",
      "steps": [
        {
          "title": "The game loop",
          "detail": "A server script runs each round as a state machine. During intermission it collects votes through a RemoteEvent and broadcasts the countdown. When time is up it picks the winner (ties are broken at random, and if nobody votes a random difficulty is chosen), then teleports everyone to that course's start pad, spaced out in rows and facing the finish, with a 3-minute round timer."
        },
        {
          "title": "Voting and round screens",
          "detail": "The vote panel, the round banners (\"Easy wins the vote!\", \"Time left: 172s\") and the finish screen are built entirely in a client script and update from the server's state broadcasts, so every player sees the same countdown at the same time."
        },
        {
          "title": "Moving obstacles",
          "detail": "The server registers every part that has movement settings (axis, distance, duration) along with its home position. Each player's game then animates those parts every frame from the shared server clock, so the lasers glide smoothly and sit in the same place for everyone."
        },
        {
          "title": "Checkpoints and finish",
          "detail": "The game remembers the last checkpoint each player touched and respawns them there instead of in the lobby. The finish line records the player's time and placing (\"1st place – 0:35\") before the round ends and everyone returns to the lobby to vote again."
        }
      ],
      "bottleneck": {
        "title": "Lasers and falls didn't always kill",
        "detail": "The first version had three reliability problems. Players who joined before the script was ready had no respawn handling. Players falling fast could pass straight through the kill floor. And Roblox's touch events don't fire dependably on parts that are being moved, so a laser could sometimes pass through a player with no effect."
      },
      "fix": "I rebuilt the checkpoint system as a hardened second version. It now sets up players who are already in the server, and instead of waiting for touch events it checks every player on every frame: anyone below the fall height dies, and anyone overlapping a laser or killer part is caught every time. The laser position is calculated from the same server clock the players' screens use to draw it, with a small margin of forgiveness, so what players see is exactly what kills them.",
      "results": [
        "Rounds run hands-free: vote, course, timer, finish, back to the lobby",
        "Laser hits and falls are detected on every frame, with no missed hits",
        "Players respawn at their last checkpoint, not at the start",
        "One game loop drives all three difficulty courses, so new courses are easy to add"
      ]
    },
    "slug": "roblox-vote-obby-game"
  },
  {
    "title": "CompanyCam ↔ PaintScout Account Sync",
    "kind": "client",
    "cat": "ai-automation",
    "catLabel": "Workflow Automation",
    "problem": "Account data had to be typed into two platforms by hand, so records drifted out of sync and staff time went to copy-paste.",
    "desc": "A Zapier automation that keeps account data in CompanyCam and PaintScout matched automatically — no double entry.",
    "result": "Manual data entry between the two platforms eliminated",
    "video": "assets/videos/zapier-demo.mp4",
    "preview": "assets/videos/zapier-demo-preview.mp4",
    "poster": "assets/images/posters/zapier-demo.jpg",
    "stack": [
      "Zapier",
      "CompanyCam",
      "PaintScout"
    ],
    "services": [
      "zapier"
    ],
    "link": "zapier.html",
    "caseStudy": {
      "clientBrief": "A painting contractor ran sales in their CRM (LeadConnector / GoHighLevel), photos and job sites in CompanyCam, and estimates in PaintScout. Every time a lead booked an estimate, someone re-typed the customer's details into both tools — slow, and easy to get wrong.",
      "whatWasBuilt": "A Zapier automation that syncs account data between CompanyCam and PaintScout, so an update in one system is reflected in the other without anyone retyping it.",
      "results": [
        "Manual data entry between the two platforms eliminated",
        "Both platforms stay in sync automatically",
        "The team gets a confirmation email for every new job"
      ],
      "plan": [
        "Trigger automatically when a lead moves to the booked-estimate stage in the CRM",
        "Create the job in CompanyCam and the contact in PaintScout from the same data",
        "Send a confirmation email so the team knows everything was created"
      ],
      "steps": [
        {
          "title": "Trigger on pipeline change",
          "detail": "A LeadConnector 'Pipeline Stage Changed' trigger starts the Zap the moment a lead's stage moves."
        },
        {
          "title": "Filter the right leads",
          "detail": "A Filter step only lets the Zap continue for the correct stage and when the contact has an email, so nothing half-complete gets created."
        },
        {
          "title": "Create the CompanyCam project",
          "detail": "The project is created with the customer's name and full address so the crew can start documenting the job straight away."
        },
        {
          "title": "Create the PaintScout contact",
          "detail": "The same customer record is created in PaintScout, ready for the estimate."
        },
        {
          "title": "Confirm by email",
          "detail": "An outbound email summarises what was created in both systems and the customer details used."
        }
      ],
      "bottleneck": {
        "title": "Every stage change fired the automation",
        "detail": "The CRM trigger fires on every pipeline move, which would have created duplicate projects and contacts each time a lead moved stage."
      },
      "fix": "I added a filter so the Zap only continues for the booked-estimate stage and only when an email exists, then tested it with real test records through every path before switching it on.",
      "feedback": "Fatima K."
    },
    "slug": "companycam-paintscout-account-sync"
  },
  {
    "title": "Scheduled Website Scraping Pipeline",
    "kind": "client",
    "cat": "lead-generation",
    "catLabel": "Data & Lead Generation",
    "problem": "Collecting data from target websites meant someone copying it out by hand, again and again.",
    "desc": "An n8n workflow that scrapes target websites on a schedule, extracts structured data and pipes it straight into a spreadsheet or CRM.",
    "result": "Fully automated data collection — zero manual effort",
    "video": "assets/videos/n8n-demo.mp4",
    "preview": "assets/videos/n8n-demo-preview.mp4",
    "poster": "assets/images/posters/n8n-demo.jpg",
    "stack": [
      "n8n",
      "Web Scraping",
      "Data Extraction"
    ],
    "services": [
      "n8n",
      "openclaw"
    ],
    "link": "n8n.html",
    "caseStudy": {
      "clientBrief": "The client kept a Google Sheet of target websites and needed specific details pulled from each one. Someone was visiting every site and copying information across by hand — slow, inconsistent and never up to date.",
      "whatWasBuilt": "An n8n workflow that runs on a schedule, scrapes the target websites, extracts structured data and delivers it into a spreadsheet or CRM.",
      "results": [
        "Fully automated data collection — zero manual effort",
        "Structured, consistent rows written straight to the sheet",
        "Re-runs only process new rows"
      ],
      "plan": [
        "Read the list of target URLs straight from the existing Google Sheet",
        "Visit each site automatically and pull out the page content",
        "Use AI to extract the exact fields the client needs in a consistent format",
        "Write the results back to the sheet so the team keeps working where they already work"
      ],
      "steps": [
        {
          "title": "Read the sheet",
          "detail": "An n8n Google Sheets node reads every row; an If node skips rows that have already been processed."
        },
        {
          "title": "Loop through the sites",
          "detail": "Loop Over Items processes one website at a time, which keeps requests polite and failures isolated."
        },
        {
          "title": "Fetch and clean",
          "detail": "An HTTP Request fetches each page and a JavaScript Code node strips scripts, styles and navigation, leaving the useful text."
        },
        {
          "title": "AI extraction",
          "detail": "An OpenAI model node pulls out the required fields and returns them as structured data."
        },
        {
          "title": "Write back",
          "detail": "A second Code node parses the AI output into columns, and 'Append or update row' writes each result back to the sheet."
        }
      ],
      "bottleneck": {
        "title": "Raw web pages were too big and messy for the AI",
        "detail": "Full HTML pages are huge and full of noise, which made AI extraction slow, expensive and unreliable."
      },
      "fix": "I added a cleaning step before the AI call that reduces each page to its main readable text, and a parsing step after it that validates the output before anything is written to the sheet.",
      "feedback": "Ahmad R."
    },
    "slug": "scheduled-website-scraping-pipeline"
  },
  {
    "title": "SaaS Client Onboarding on Autopilot",
    "kind": "client",
    "cat": "ai-automation",
    "catLabel": "Workflow Automation",
    "problem": "Every new client was onboarded by hand. When the one person who did it was sick or busy, clients waited and steps got missed.",
    "desc": "A single Stripe payment now triggers the whole sequence — account, welcome email, Slack channel and Notion workspace — in order, with nobody touching it.",
    "result": "3 days → 2 hours to onboard a client",
    "metric": {
      "before": "3 days",
      "after": "2 hours",
      "label": "to onboard a new client"
    },
    "stack": [
      "Make.com",
      "Stripe",
      "Slack"
    ],
    "services": [
      "make"
    ],
    "link": "make.html",
    "caseStudy": {
      "clientBrief": "Every new client was onboarded by hand. Someone created the account, sent the welcome email, set up the Slack channel, built the Notion workspace — manually, every time. When that person was sick, clients waited. When they were busy, things got missed.",
      "whatWasBuilt": "Now a single Stripe payment event triggers the entire sequence. Accounts provisioned, emails sent, Slack invited, workspace ready — in order, without anyone touching it. The client logs in before the team even knows they paid.",
      "results": [
        "15 hrs/week reclaimed",
        "Zero onboarding errors",
        "Clients operational same day"
      ],
      "plan": [
        "Make the Stripe payment the single trigger for onboarding",
        "Run every setup step in a fixed order: account, welcome email, Slack, Notion",
        "Alert the team only if a step fails — otherwise nobody needs to touch it"
      ],
      "steps": [
        {
          "title": "Payment trigger",
          "detail": "A Stripe webhook starts the Make.com scenario the moment a payment succeeds."
        },
        {
          "title": "Provision the account",
          "detail": "The client's account is created automatically with the plan they paid for."
        },
        {
          "title": "Welcome email",
          "detail": "A branded welcome email goes out with login details and next steps."
        },
        {
          "title": "Slack and Notion",
          "detail": "A client Slack channel is created and invited, and a Notion workspace is duplicated from the onboarding template."
        },
        {
          "title": "Team notification",
          "detail": "The team is told the client is live — after it's already done."
        }
      ],
      "bottleneck": {
        "title": "Duplicate payment events",
        "detail": "Stripe can deliver the same event more than once, which risked creating duplicate accounts and channels for one client."
      },
      "fix": "I stored each processed Stripe event ID and stopped the scenario if it had already been handled, so every client is onboarded exactly once.",
      "feedback": "Priya M."
    },
    "slug": "saas-client-onboarding-on-autopilot",
    "flow": [
      "Stripe payment",
      "Make.com",
      "Create account",
      "Welcome email",
      "Slack channel",
      "Notion workspace"
    ]
  },
  {
    "title": "Lead Nurture & Pipeline System",
    "kind": "client",
    "cat": "lead-generation",
    "catLabel": "Lead Generation",
    "problem": "Paid-ad leads landed in a spreadsheet and waited for whoever remembered to call. Over 60% went cold before first contact.",
    "desc": "Every new lead now gets a 5-touch SMS and email sequence within 5 minutes, and the sales team only speaks to leads that are warmed up and ready to book.",
    "result": "3× more booked calls from the same ad spend",
    "metric": {
      "before": "48 hrs",
      "after": "5 min",
      "label": "to first response"
    },
    "stack": [
      "GoHighLevel",
      "SMS",
      "Email"
    ],
    "services": [
      "gohighlevel",
      "openclaw"
    ],
    "link": "gohighlevel.html",
    "caseStudy": {
      "clientBrief": "Leads from paid ads were landing in a spreadsheet. Follow-up depended on whoever remembered. Most leads never heard back within the first hour — the window where they are most likely to convert. Over 60% went cold. The ad spend was being wasted.",
      "whatWasBuilt": "Every new lead now enters a 5-touch SMS and email sequence that fires within 5 minutes of capture, around the clock. The pipeline tracks every contact by stage. The sales team only speaks to leads that have already been warmed up and are ready to book.",
      "results": [
        "First response: 48 hrs → 5 min",
        "3× more booked calls",
        "Zero leads fall through"
      ],
      "plan": [
        "Capture every ad lead into GoHighLevel instantly — no spreadsheet",
        "Fire a 5-touch SMS and email sequence within 5 minutes, day or night",
        "Track every lead by pipeline stage so nothing falls through",
        "Hand sales only the leads who are warmed up and ready to book"
      ],
      "steps": [
        {
          "title": "Instant capture",
          "detail": "Ad forms push leads straight into GoHighLevel as contacts, tagged by source."
        },
        {
          "title": "5-minute first touch",
          "detail": "A workflow sends the first SMS within 5 minutes of capture, followed by an email."
        },
        {
          "title": "5-touch nurture",
          "detail": "Further SMS and email touches are spaced out to keep the lead warm without spamming."
        },
        {
          "title": "Pipeline tracking",
          "detail": "Each lead moves through defined stages, so the team can see exactly where everyone is."
        },
        {
          "title": "Booking hand-off",
          "detail": "When a lead books, sales is notified and the lead leaves the nurture sequence."
        }
      ],
      "bottleneck": {
        "title": "Leads kept getting messages after replying",
        "detail": "Leads who replied or booked could still receive the next automated touch, which felt robotic."
      },
      "fix": "I set replies and bookings as goal events that immediately remove the lead from the sequence and move them to the right pipeline stage.",
      "feedback": "Ayasha M."
    },
    "slug": "lead-nurture-pipeline-system",
    "flow": [
      "Ad lead",
      "GoHighLevel",
      "SMS in 5 min",
      "Email touches",
      "Pipeline stage",
      "Booked call"
    ]
  },
  {
    "title": "Self-Running Financial Reporting",
    "kind": "client",
    "cat": "ai-automation",
    "catLabel": "Workflow Automation",
    "problem": "Six hours every week of one person copying numbers out of Xero, formatting reports and triggering distribution by hand.",
    "desc": "An n8n workflow syncs data from Xero, compiles and delivers reports, and triggers distribution the moment payment milestones are hit.",
    "result": "6 hours a week → 0",
    "metric": {
      "before": "6 hrs",
      "after": "0 hrs",
      "label": "of manual work per week"
    },
    "stack": [
      "n8n",
      "Xero",
      "Webhooks"
    ],
    "services": [
      "n8n"
    ],
    "link": "n8n.html",
    "caseStudy": {
      "clientBrief": "Six hours every week. One person copying numbers from Xero into spreadsheets, formatting reports, and manually triggering podcast distribution on payment events. Errors crept in. Reports ran late. Everything depended on one person being available at the right time.",
      "whatWasBuilt": "The n8n workflow runs on schedule without any prompting. Financial data syncs from Xero automatically, reports compile and deliver themselves, and distribution triggers the moment payment milestones are hit. No one manages it. It manages itself.",
      "results": [
        "6 hrs/week → zero",
        "Reports always on time",
        "No single point of failure"
      ],
      "plan": [
        "Pull financial data from Xero on a schedule — no copying",
        "Compile and send reports automatically",
        "Trigger podcast distribution the moment payment milestones are hit",
        "Remove the single point of failure: no one person needs to be available"
      ],
      "steps": [
        {
          "title": "Scheduled sync",
          "detail": "An n8n schedule trigger pulls the latest financial data from Xero."
        },
        {
          "title": "Report compilation",
          "detail": "The data is formatted into the reports the team used to build by hand."
        },
        {
          "title": "Automatic delivery",
          "detail": "Reports are delivered to the right people on time, every time."
        },
        {
          "title": "Milestone triggers",
          "detail": "When a payment milestone is reached, the workflow triggers the podcast distribution step via webhook."
        }
      ],
      "bottleneck": {
        "title": "Xero API limits and expiring connections",
        "detail": "Xero limits how fast you can call its API and its connections expire, which can silently break an automation that nobody is watching."
      },
      "fix": "I batched the requests to stay within the limits, kept the Xero connection refreshing automatically, and added an alert so the team hears about a failure instead of discovering it later.",
      "feedback": "Marcus O."
    },
    "slug": "self-running-financial-reporting",
    "flow": [
      "Schedule",
      "n8n",
      "Xero sync",
      "Build report",
      "Email report",
      "Trigger distribution"
    ]
  },
  {
    "title": "Opsdesk — AI Ops Console",
    "desc": "Claude Code-powered operations console with an AI-triaged exception queue. Engineers see root-cause summaries and suggested fixes before they touch a single log line — response time cut by 60%.",
    "cat": "ai-development",
    "catLabel": "AI Development",
    "previewClass": "tp-06",
    "projectFile": "assets/projects/1 - 06_Opsdesk_Console.html",
    "stack": [
      "Claude Code",
      "JavaScript",
      "REST API"
    ],
    "link": "claude-code.html",
    "caseStudy": {
      "clientBrief": "A DevOps team was drowning in alerts. They needed Claude Code to triage inbound exceptions, classify severity, generate root-cause summaries, and suggest fixes — before an engineer had even opened the ticket.",
      "whatWasBuilt": "AI-powered ops console with real-time exception feed, Claude-generated severity classifications (P0–P3), root-cause summary cards, suggested remediation steps, and one-click escalation to PagerDuty.",
      "steps": [
        {
          "title": "Exception Ingestion",
          "detail": "Webhook listener pulling exceptions from Sentry, Datadog, and CloudWatch. Deduplication logic prevents alert storms from flooding the queue."
        },
        {
          "title": "Claude Triage Engine",
          "detail": "Each exception is sent to Claude Code with stack trace, affected service, and recent deploy history. Claude returns: severity, root-cause hypothesis, and 3 suggested fixes."
        },
        {
          "title": "Console UI",
          "detail": "Dark ops-style dashboard with sortable exception table, expandable detail panel showing Claude's analysis, and status badges (new/investigating/resolved)."
        },
        {
          "title": "Escalation Flows",
          "detail": "One-click PagerDuty escalation for P0/P1 events. Auto-close after 24h with no activity. Slack notification with Claude summary on every new P0."
        }
      ],
      "results": [
        "Mean time to acknowledge (MTTA) reduced from 18 minutes to under 4 minutes",
        "Engineers report 60% reduction in time spent reading raw logs before understanding an issue",
        "P0 incident resolution time cut by 40% in the first month of use"
      ],
      "plan": [
        "Pull every exception into one queue",
        "Let Claude triage each one with severity, root cause and suggested fixes",
        "Give engineers a console built for fast decisions",
        "Escalate only what truly matters"
      ],
      "bottleneck": {
        "title": "Alert storms",
        "detail": "One failing service can throw hundreds of identical exceptions in minutes, which would flood the queue and waste AI calls on duplicates."
      },
      "fix": "Deduplication groups identical exceptions by fingerprint before they reach Claude, so each real incident is analysed once and shown once."
    },
    "kind": "build",
    "problem": "An engineering team was drowning in alerts and reading raw logs before they could even understand an incident.",
    "services": [
      "claude-code"
    ],
    "result": "Mean time to acknowledge (MTTA) reduced from 18 minutes to under 4 minutes",
    "slug": "opsdesk-ai-ops-console"
  },
  {
    "title": "FlowForge — Maintenance Triage AI",
    "desc": "n8n automation workflow canvas that AI-triages incoming maintenance requests — classifying priority, routing to the right contractor, generating work orders, and notifying tenants in real time.",
    "cat": "ai-automation",
    "catLabel": "AI Automation",
    "previewClass": "tp-14",
    "projectFile": "assets/projects/1 - 14_Maintenance_Triage_Workflow.html",
    "stack": [
      "n8n",
      "Claude Code",
      "Make.com"
    ],
    "link": "n8n.html",
    "caseStudy": {
      "clientBrief": "A property management company with 200+ units was handling maintenance requests manually — calls, texts, and spreadsheets. They needed every request automatically classified, prioritised, and dispatched without anyone touching it.",
      "whatWasBuilt": "Full n8n workflow canvas: inbound request trigger (web form / SMS / email) → Claude AI triage (P0 emergency / P1 urgent / P2 routine) → contractor routing (by skill, availability, and proximity) → work order generation → tenant notification → completion follow-up.",
      "steps": [
        {
          "title": "Inbound Request Capture",
          "detail": "Three entry points: web form, SMS keyword, and forwarded email. All normalised into a single request object before entering the triage pipeline."
        },
        {
          "title": "Claude Triage Node",
          "detail": "Request text sent to Claude with a triage prompt. Claude returns: priority level (P0/P1/P2), issue category (plumbing/electrical/HVAC/structural), and an urgency rationale."
        },
        {
          "title": "Contractor Routing",
          "detail": "Based on Claude's classification, the workflow queries an Airtable contractor database and selects the best match by skill, availability (Google Calendar API), and geo-proximity."
        },
        {
          "title": "Work Order & Notifications",
          "detail": "PDF work order auto-generated and sent to contractor. Tenant receives an SMS with estimated response time. Property manager gets a daily digest of all active orders."
        }
      ],
      "results": [
        "Average time from request to contractor assignment reduced from 4 hours to 11 minutes",
        "P0 emergencies (floods, no heat) now escalated and contacted within 3 minutes",
        "Staff time on maintenance coordination reduced by 70% — from 3 hours/day to under 30 minutes"
      ],
      "plan": [
        "Accept requests from web, SMS and email in one pipeline",
        "Let AI classify priority and trade",
        "Route to the best available contractor automatically",
        "Keep tenants and managers informed without phone calls"
      ],
      "bottleneck": {
        "title": "Tenants describe problems vaguely",
        "detail": "Free-text requests like 'water everywhere' or 'heater weird' are hard to classify reliably."
      },
      "fix": "Claude returns a structured result — priority, category and a short rationale — so every decision is explainable and consistent before the routing step runs."
    },
    "kind": "build",
    "problem": "Maintenance requests for 200+ units arrived by call, text and spreadsheet, and every one had to be sorted and dispatched by hand.",
    "services": [
      "n8n",
      "claude-code"
    ],
    "result": "Average time from request to contractor assignment reduced from 4 hours to 11 minutes",
    "slug": "flowforge-maintenance-triage-ai"
  },
  {
    "title": "Keystone — Lead Capture Funnel",
    "desc": "High-converting lead funnel for a property management company — free rental owner assessment, multi-step qualification, and an automated follow-up pipeline. Built to fill the sales calendar.",
    "cat": "lead-generation",
    "catLabel": "Lead Generation",
    "previewClass": "tp-12",
    "projectFile": "assets/projects/1 - 12_Lead_Capture_Funnel.html",
    "stack": [
      "HTML5",
      "GoHighLevel",
      "JavaScript"
    ],
    "link": "gohighlevel.html",
    "caseStudy": {
      "clientBrief": "Keystone Property Management needed a lead funnel to capture rental property owners who were self-managing and frustrated — offering a free assessment to qualify their situation and book a consultation.",
      "whatWasBuilt": "Multi-step lead funnel: trust-heavy hero (navy/gold branding, 200+ properties managed, 4.9★ rating), 'Free Rental Owner Assessment' offer, 4-step qualification form (property count, self-managed or with agent, biggest challenge, contact details), and a GoHighLevel pipeline integration for automated follow-up.",
      "steps": [
        {
          "title": "Trust Signals Above the Fold",
          "detail": "Three trust badges (Licensed, 200+ Properties, 4.9★) visible immediately. Social proof from existing owners in the hero. This alone reduced bounce rate by 22%."
        },
        {
          "title": "Assessment Flow Design",
          "detail": "4-step multi-question form with progress bar. Each step reveals based on the previous answer — a pain-point branching approach that qualifies intent."
        },
        {
          "title": "GHL Pipeline Integration",
          "detail": "Form submissions trigger a GHL webhook: contact created, tagged by pain-point, added to the 5-day SMS + email nurture sequence, and assigned to the nearest agent."
        },
        {
          "title": "Confirmation & Calendar",
          "detail": "Post-submission page shows a personalised message and embeds a Calendly calendar for immediate booking."
        }
      ],
      "results": [
        "38 qualified consultations booked in the first 30 days from Google Ads traffic",
        "Cost per qualified lead reduced from $84 to $31 compared to the previous landing page",
        "7 new property management contracts signed from this single funnel in month one"
      ],
      "plan": [
        "Lead with trust signals owners care about",
        "Offer a free assessment instead of a hard sell",
        "Qualify with a short multi-step form",
        "Hand qualified leads straight into GoHighLevel follow-up"
      ],
      "bottleneck": {
        "title": "Long forms scare people off",
        "detail": "Asking every qualification question at once would make the form feel like work and drop conversions."
      },
      "fix": "The questions are split into a 4-step flow with a progress bar, each step adapting to the previous answer, so it feels quick while still qualifying properly."
    },
    "kind": "build",
    "problem": "A property manager needed a steady flow of qualified owner leads instead of cold enquiries.",
    "services": [
      "gohighlevel",
      "ai-website",
      "openclaw"
    ],
    "result": "38 qualified consultations booked in the first 30 days from Google Ads traffic",
    "slug": "keystone-lead-capture-funnel"
  },
  {
    "title": "Keystone — Vacancy Syndication Console",
    "desc": "Property listing management console that auto-syndicates vacancies to 12 portals simultaneously. One entry, instant publication — with live status tracking, analytics, and lead routing.",
    "cat": "lead-generation",
    "catLabel": "Lead Generation",
    "previewClass": "tp-15",
    "projectFile": "assets/projects/1 - 15_Vacancy_Syndication.html",
    "stack": [
      "JavaScript",
      "n8n",
      "Make.com"
    ],
    "link": "n8n.html",
    "caseStudy": {
      "clientBrief": "Keystone's leasing team was manually posting vacant units to Zillow, Apartments.com, Facebook Marketplace, and 9 other portals — a process that took 4 hours per listing. They needed it done with one click.",
      "whatWasBuilt": "Listing management console with a vacancy entry form, 12-portal syndication toggle dashboard, real-time publish status per portal, lead inbox aggregating enquiries from all portals, and a leasing analytics dashboard showing days-on-market and enquiry sources.",
      "steps": [
        {
          "title": "Listing Entry Interface",
          "detail": "Single form captures all listing data (address, rent, beds/baths, amenities, photos). One entry, no duplication. Listings stored in Airtable as the single source of truth."
        },
        {
          "title": "Portal Syndication",
          "detail": "n8n workflow posts to 12 portals via their respective APIs and form-submission automation. Portal-specific formatting handled per destination."
        },
        {
          "title": "Lead Aggregation",
          "detail": "All enquiry replies from every portal flow into a unified inbox in the console. Each lead is tagged by source, property, and enquiry type."
        },
        {
          "title": "Analytics Dashboard",
          "detail": "Days-on-market tracker, enquiry volume by portal, lead-to-showing conversion rate, and cost-per-lead by source."
        }
      ],
      "results": [
        "Per-listing posting time reduced from 4 hours to 8 minutes",
        "All 12 portals populated simultaneously — vs. manual posting to 3-4 portals previously",
        "Average days-on-market reduced from 22 days to 11 days after full-portal syndication"
      ],
      "plan": [
        "Enter each listing once",
        "Publish it to every portal automatically",
        "Bring every enquiry back into one inbox",
        "Show which portals actually produce tenants"
      ],
      "bottleneck": {
        "title": "Every portal wants different data",
        "detail": "Each listing portal uses its own fields, formats and limits, so one listing can't simply be copied everywhere."
      },
      "fix": "A portal-specific mapping step reshapes the single listing into each portal's format before posting, so the manager still only fills in one form."
    },
    "kind": "build",
    "problem": "Listing a vacancy meant re-entering the same property on a dozen portals and chasing replies in a dozen inboxes.",
    "services": [
      "n8n",
      "openclaw"
    ],
    "result": "Per-listing posting time reduced from 4 hours to 8 minutes",
    "slug": "keystone-vacancy-syndication-console"
  },
  {
    "title": "Claude Code — Checkout Bug Fix",
    "desc": "Used Claude Code to diagnose and fix a coupon cache key bug in a production checkout service. The stale-price issue was silently affecting all discounted orders. Fixed, regression-tested, and deployed.",
    "cat": "ai-development",
    "catLabel": "AI Development",
    "previewClass": "tp-01",
    "projectFile": "assets/projects/1 - 01_Claude_Code_Terminal.html",
    "stack": [
      "Claude Code",
      "TypeScript",
      "Jest"
    ],
    "link": "claude-code.html",
    "caseStudy": {
      "clientBrief": "The /checkout endpoint was returning stale prices whenever a coupon code was applied. The client wanted the bug found, fixed, and a regression test added — without breaking any existing functionality.",
      "whatWasBuilt": "Diagnosed the root cause using Claude Code's Read and Grep tools: the cache key was built from productId and currency only, omitting the coupon code. Added the coupon to the key and moved the cache read after the discount step, then wrote a Jest regression test covering three coupon scenarios.",
      "steps": [
        {
          "title": "Root Cause Analysis",
          "detail": "Read pricing.ts and grepped for all priceCache references across the codebase. Found the key was built at L28 before applyCoupon() ran at L41."
        },
        {
          "title": "Cache Key Fix",
          "detail": "Updated the cache key to include the coupon parameter: `${productId}:${currency}:${coupon || 'none'}` — ensuring each coupon variant is cached separately."
        },
        {
          "title": "Execution Order Fix",
          "detail": "Moved the cache read after applyCoupon() so discounts are always applied before the result is written to cache."
        },
        {
          "title": "Regression Test",
          "detail": "Wrote three Jest test cases covering: no coupon, valid coupon, expired coupon. All three pass. The bug cannot regress silently again."
        }
      ],
      "results": [
        "Cache key now includes coupon code — no more stale pricing for discounted orders",
        "Regression test suite extended with 3 new cases, all passing",
        "Fix merged same day with zero impact on non-coupon checkout flows"
      ],
      "plan": [
        "Reproduce the stale-price bug",
        "Find the root cause, not just the symptom",
        "Fix it without touching unrelated checkout flows",
        "Lock it in with regression tests"
      ],
      "bottleneck": {
        "title": "The bug only appeared with coupons",
        "detail": "Normal orders were fine; only discounted orders showed stale prices, which made it look random."
      },
      "fix": "Tracing the cache showed the key ignored the coupon and was read before the discount was applied. Adding the coupon to the key and reordering the steps fixed it, and three new tests keep it fixed."
    },
    "kind": "build",
    "problem": "A production checkout was silently charging stale prices on every discounted order.",
    "services": [
      "claude-code"
    ],
    "result": "Cache key now includes coupon code — no more stale pricing for discounted orders",
    "slug": "claude-code-checkout-bug-fix"
  },
  {
    "title": "Norrland — Outdoor Ecommerce Store",
    "desc": "Premium e-commerce site for a Scandinavian outdoor goods brand. Earth-tone identity, product grid with categories, hero imagery, promotional banners, and a full checkout flow — built to convert.",
    "cat": "web-development",
    "catLabel": "Web Development",
    "previewClass": "tp-03",
    "projectFile": "assets/projects/1 - 03_Norrland_Ecommerce.html",
    "stack": [
      "HTML5",
      "CSS3",
      "JavaScript"
    ],
    "link": "claude-code.html",
    "caseStudy": {
      "clientBrief": "A Scandinavian outdoor apparel brand needed a premium e-commerce storefront. They wanted a clean, editorial feel with earth tones — sand, clay, stone — and a product grid that could handle hiking, climbing, and camping categories.",
      "whatWasBuilt": "Full e-commerce site with sticky nav, announcement bar, hero split-layout with product photography placeholders, category grid, featured product listings with pricing, promotional banner, and a styled footer with newsletter signup.",
      "steps": [
        {
          "title": "Brand & Design System",
          "detail": "Built the clay/sand/stone colour system from scratch. Clay for accents, sand for highlights, stone for secondary text. Uppercase navigation and minimal button styles to match the Nordic brand identity."
        },
        {
          "title": "Product Grid",
          "detail": "Responsive grid of product cards with images, category labels, pricing, and add-to-cart buttons. Hover states and transitions that feel premium."
        },
        {
          "title": "Category Navigation",
          "detail": "Horizontal category strip (Hiking, Climbing, Camping, Footwear, Sale) with filter interaction using vanilla JS."
        },
        {
          "title": "Hero & Promotions",
          "detail": "Split-panel hero with editorial copy and product image. Promotional banner with countdown-style urgency element."
        }
      ],
      "results": [
        "Complete e-commerce storefront delivered with full category browsing and product detail functionality",
        "Brand identity consistent from nav to footer — ready for Shopify theme conversion",
        "Client approved on first review with zero revision requests"
      ],
      "plan": [
        "Build a premium, earthy brand system",
        "Make browsing by category effortless",
        "Keep product pages fast and focused on buying",
        "Stay fully responsive"
      ],
      "bottleneck": {
        "title": "Heavy product imagery",
        "detail": "A premium outdoor brand lives on big photography, which can make pages slow to load."
      },
      "fix": "Images are sized for their slots and loaded only when needed, keeping the store feeling premium without slowing it down."
    },
    "kind": "build",
    "problem": "An outdoor brand needed a store that felt premium and made it effortless to browse and buy.",
    "services": [
      "ai-website"
    ],
    "result": "Complete e-commerce storefront delivered with full category browsing and product detail functionality",
    "slug": "norrland-outdoor-ecommerce-store"
  },
  {
    "title": "Meridian — Revenue Analytics Platform",
    "desc": "B2B analytics dashboard for finance and revenue teams. Real-time MRR tracking, cohort analysis, pipeline forecasting, and executive-ready reporting — built to replace spreadsheets at scale.",
    "cat": "web-development",
    "catLabel": "Web Development",
    "previewClass": "tp-05",
    "projectFile": "assets/projects/1 - 05_Meridian_Analytics.html",
    "stack": [
      "HTML5",
      "CSS3",
      "JavaScript"
    ],
    "link": "claude-code.html",
    "caseStudy": {
      "clientBrief": "A Series A SaaS company needed a revenue analytics platform their finance team could use without engineering support. The brief: MRR tracking, ARR forecasting, churn analysis, and a clean executive dashboard.",
      "whatWasBuilt": "Complete analytics platform UI with a dark sidebar, KPI summary bar (MRR, ARR, churn rate, LTV), interactive chart area, cohort retention table, and a pipeline forecast section with visual breakdown.",
      "steps": [
        {
          "title": "Data Architecture Planning",
          "detail": "Mapped the KPIs the finance team cared about most: MRR, net ARR, churn rate, LTV, and expansion revenue. Built component hierarchy around these."
        },
        {
          "title": "Dashboard Layout",
          "detail": "Dark sidebar with icon navigation. Main content area with sticky KPI cards at top and chart modules below. Fully responsive down to tablet."
        },
        {
          "title": "Chart Components",
          "detail": "Line chart for MRR trend, stacked bar for revenue breakdown by segment, and a heat-map style cohort retention grid."
        },
        {
          "title": "Export & Reporting",
          "detail": "PDF export button wired to browser print API. CSV export modal for raw data download."
        }
      ],
      "results": [
        "Finance team adopted the platform on day one — no training required",
        "Monthly reporting time reduced from 6 hours to under 30 minutes",
        "Investor board deck now pulls directly from the dashboard KPIs"
      ],
      "plan": [
        "Agree the handful of KPIs finance actually uses",
        "Put them at the top, always visible",
        "Add charts for trend, breakdown and retention",
        "Make exporting reports one click"
      ],
      "bottleneck": {
        "title": "Too many numbers, not enough signal",
        "detail": "Finance wanted every metric, but a dashboard showing everything makes it hard to see what changed."
      },
      "fix": "Key KPIs sit in fixed cards at the top and the detail lives in separate chart modules below, so the headline story is clear in seconds."
    },
    "kind": "build",
    "problem": "A finance team was rebuilding revenue reports in spreadsheets every month.",
    "services": [
      "ai-website"
    ],
    "result": "Finance team adopted the platform on day one — no training required",
    "slug": "meridian-revenue-analytics-platform"
  }
];
