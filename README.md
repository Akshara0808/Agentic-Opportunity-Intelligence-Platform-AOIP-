# Opportunity Radar

## Team Details

### Team Name

Opportunity Radar

### Team Members

| Name        | Roll Number | Branch |
| ----------- | ----------- | ------ |
| V. Shreni   | 23071A0564  | CSE    |
| M. Akshara  | 23071A0538  | CSE    |
| E. Poojitha | 23071A0514  | CSE    |

---
## Project Overview

Opportunity Radar is an Agentic AI-powered platform that helps users discover high-potential business opportunities by automatically collecting, validating, enriching, and ranking information from multiple sources.

Traditional lead generation and market research require significant manual effort to identify promising companies, analyze market signals, and find relevant decision-makers. Opportunity Radar addresses this challenge through a planner-driven multi-agent system where specialized AI agents collaborate to perform these tasks autonomously.

The platform uses a central Planner Agent to analyze user intent and dynamically orchestrate multiple specialized agents, including company discovery, validation, research, and contact extraction agents. These agents share information through a common memory layer and utilize external tools to gather real-time insights.

The processed information is then evaluated by a Recommendation Agent, which prioritizes the most promising opportunities and presents them through an interactive dashboard. A human approval layer ensures transparency and control before any final action is taken.

### Problem Statement

Businesses spend considerable time identifying potential opportunities, researching companies, and gathering relevant contact information. The process is often fragmented across multiple platforms and requires extensive manual effort.

### Our Solution

Opportunity Radar automates this workflow using a dynamic multi-agent architecture that can:

* Discover potential companies based on user-defined signals
* Validate and filter relevant opportunities
* Enrich company profiles with additional research
* Identify key decision-makers and contacts
* Rank opportunities based on relevance and potential value
* Present actionable insights through a unified dashboard

By combining AI planning, agent collaboration, shared memory, and human oversight, Opportunity Radar transforms opportunity discovery into an intelligent and scalable process.

## GitHub Repository

Repository Link:

https://github.com/shrenirao/opportunity-radar

---

## Setup Instructions

### Prerequisites

* Python 3.10+
* Node.js 18+
* npm

---

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install required dependencies:

```bash
pip install fastapi uvicorn
```

3. Start the FastAPI server:

```bash
uvicorn main:app --reload --port 8000
```

4. Backend will be available at:

```text
http://127.0.0.1:8000
```

---

### Frontend Setup

1. Open a new terminal.

2. Navigate to the project root directory:

```bash
cd opportunity-radar
```

3. Install dependencies:

```bash
npm install
```

4. Start the Vite development server:

```bash
npm run dev
```

5. Open the generated local URL in your browser (typically):

```text
http://localhost:5173
```

---

## Architecture Summary

The platform follows a planner-based multi-agent architecture consisting of:

* Frontend Interface
* FastAPI Backend Layer
* Planner (LLM Orchestrator)
* Agent Registry
* Shared Memory
* Dynamic Agent Execution Engine
* Tool Layer
* Recommendation Agent
* Human Approval Layer
* Dashboard

This design enables scalable and dynamic agent collaboration for intelligent opportunity discovery.

---

## Future Improvements

* Integration with real-time news and market intelligence APIs
* Advanced lead scoring models
* CRM integration (Salesforce, HubSpot)
* Multi-user authentication and role management
* Persistent vector database for long-term memory
* Automated outreach generation
* Analytics and performance tracking dashboard
* Deployment on cloud infrastructure for production use

---

## Additional Notes

This project was developed as a hackathon prototype to demonstrate the potential of planner-driven agent orchestration for opportunity intelligence workflows.

The current implementation focuses on showcasing architecture, agent collaboration, and workflow automation while maintaining human oversight for final decision-making.
