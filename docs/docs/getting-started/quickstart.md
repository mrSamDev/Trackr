---
sidebar_position: 3
---

# Quickstart

Start tracking your job applications in minutes.

## First Time Setup

After completing [installation](/doc/docs/getting-started/installation), follow these steps:

### 1. Login

1. Navigate to `http://localhost:3000`
2. Click **"Login with GitHub"**
3. Authorize Trackr to access your GitHub account
4. You'll be redirected to your dashboard

### 2. Create Your First Application

Click **"New Application"** or navigate to `/new` to add your first job application:

**Required Fields:**
- **Company** - Company name (e.g., "Acme Corp")
- **Position** - Job title (e.g., "Senior Software Engineer")
- **Status** - Current stage (e.g., "Applied", "Interview", "Offer")

**Optional Fields:**
- **Location** - Job location (remote, hybrid, on-site)
- **Salary Range** - Expected compensation
- **Notes** - Additional details about the role
- **Application URL** - Link to the job posting
- **Date Applied** - When you submitted your application

### 3. Track Your Applications

View all your applications in the main dashboard:

- **Filter by status** - See applications in specific stages
- **Sort by date** - Track recent activity
- **Search** - Find applications by company or position

### 4. Update Application Status

As you progress through the hiring pipeline:

1. Click on an application to view details
2. Update the status dropdown:
   - `Applied` - Initial submission
   - `Screening` - Recruiter contact
   - `Interview` - Technical/behavioral rounds
   - `Offer` - Received an offer
   - `Rejected` - Not selected
   - `Withdrawn` - You withdrew

## Analytics Dashboard

Navigate to `/analytics` to visualize your job search:

### Key Metrics

- **Total Applications** - Count of all applications
- **Active Applications** - Currently in pipeline
- **Response Rate** - Percentage with responses
- **Interview Rate** - Percentage reaching interview stage

### Charts

- **Applications Over Time** - Track submission trends
- **Status Distribution** - Visualize pipeline stages
- **Company Types** - Breakdown by industry/size

## MCP Integration (AI Assistants)

Connect Trackr to AI assistants like Claude or Cursor for natural language management.

### Quick Setup

1. Ensure Trackr server is running
2. Add MCP server to your AI assistant config:

```json
{
  "mcpServers": {
    "trackr": {
      "command": "bun",
      "args": ["run", "src/mcp-applications.ts"]
    }
  }
}
```

3. Restart your AI assistant
4. Start asking questions like:
   - "List my pending applications"
   - "Add a new application for Senior Dev at TechCorp"
   - "Update Acme Corp status to interview"

See [MCP Integration Guide](./guides/mcp-integration) for detailed setup.

## Tips for Effective Tracking

### Stay Consistent

- Update applications immediately after actions
- Log all communications (emails, calls, interviews)
- Note follow-up dates and deadlines

### Use Notes Wisely

- Record interview questions and your answers
- Track salary ranges and benefits discussed
- Note company research and culture insights

### Regular Reviews

- Weekly: Review pending applications
- Bi-weekly: Follow up on silent applications
- Monthly: Analyze response rates and adjust strategy

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `n` | New application |
| `/` | Search applications |
| `?` | Show keyboard shortcuts |

## Next Steps

- [MCP Integration](./guides/mcp-integration) - Automate with AI
- [Analytics Dashboard](./guides/analytics-dashboard) - Deep dive into metrics
- [OAuth Setup](./guides/oauth-setup) - Configure authentication

## Need Help?

- 📖 Browse other [documentation sections](/docs/intro)
- 🐛 [Report a bug](https://github.com/mrsamdev/trackr/issues)
- 💡 [Request a feature](https://github.com/mrsamdev/trackr/issues)
