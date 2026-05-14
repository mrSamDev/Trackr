---
sidebar_position: 2
---

# Analytics Dashboard

Track your job search progress with comprehensive analytics and visualizations.

## Overview

The Analytics Dashboard (`/analytics`) provides insights into your job application pipeline through interactive charts and key metrics.

## Key Metrics

### Application Statistics

Located at the top of the dashboard, these cards show:

- **Total Applications** - All applications in your tracker
- **Active Applications** - Applications still in pipeline (not rejected/withdrawn)
- **Response Rate** - Percentage of applications with responses
- **Interview Rate** - Applications that reached interview stage
- **Offer Rate** - Applications resulting in offers

### Metric Cards

Each metric card displays:
- Current value (large number)
- Label (small caps)
- Trend indicator (when applicable)
- Color-coded status

## Charts

### Applications Over Time

**Type:** Line chart

**Purpose:** Track submission trends over time

**Features:**
- X-axis: Date range (last 30/60/90 days or custom)
- Y-axis: Number of applications
- Data points: Daily submission count
- Trend line: 7-day moving average

**Insights:**
- Identify productive periods
- Spot submission gaps
- Plan future application batches

### Status Distribution

**Type:** Pie/Donut chart

**Purpose:** Visualize pipeline stages

**Segments:**
- Applied (blue)
- Screening (yellow)
- Interview (orange)
- Offer (green)
- Rejected (red)
- Withdrawn (gray)

**Insights:**
- Pipeline health at a glance
- Bottleneck identification
- Conversion rate visualization

### Company Types

**Type:** Bar chart

**Purpose:** Breakdown by company characteristics

**Categories:**
- Industry (Tech, Finance, Healthcare, etc.)
- Company Size (Startup, Mid-size, Enterprise)
- Work Mode (Remote, Hybrid, On-site)

**Insights:**
- Application diversity
- Target market focus
- Work preference alignment

### Response Timeline

**Type:** Heatmap

**Purpose:** Show response times by company/stage

**Features:**
- X-axis: Days since application
- Y-axis: Company or status
- Color intensity: Response frequency

**Insights:**
- Average response time
- Companies with quick/slow responses
- Optimal follow-up timing

## Filters

### Time Range

Select predefined ranges or custom dates:

- Last 7 days
- Last 30 days
- Last 90 days
- Last 6 months
- All time
- Custom range (date picker)

### Status Filter

Filter charts by application status:

- Multi-select dropdown
- Quick filters: Active / All / Completed
- Invert selection option

### Company Filter

Search and filter by company name:

- Autocomplete search
- Recent companies list
- Industry tags

## Interactive Features

### Hover Details

Hover over chart elements to see:
- Exact values
- Percentages
- Date ranges
- Related applications count

### Click to Drill Down

Click chart segments to:
- View filtered application list
- See detailed breakdown
- Export subset data

### Zoom and Pan

- Pinch to zoom (mobile)
- Scroll to zoom (desktop)
- Drag to pan
- Double-click to reset

## Export Options

### Export Charts

Download charts as images:

```
Click chart menu → Download → PNG/SVG
```

**Formats:**
- PNG (raster, good for presentations)
- SVG (vector, good for publications)
- PDF (document format)

### Export Data

Export underlying data:

```
Click "Export Data" → Choose format
```

**Formats:**
- CSV (spreadsheet compatible)
- JSON (programmatic access)
- Excel (with formatting)

**Data included:**
- Application counts by status
- Daily submission data
- Response time metrics
- Company breakdowns

## Customization

### Chart Types

Switch between visualization types:

- Pie ↔ Donut
- Bar ↔ Horizontal Bar
- Line ↔ Area

### Color Schemes

Choose color palettes:

- Default (Trackr brand colors)
- Colorblind-friendly
- High contrast
- Custom (advanced)

### Layout

Adjust dashboard layout:

- Grid view (default)
- List view
- Compact mode
- Full-screen charts

## Performance Tips

### Large Datasets

For 100+ applications:

1. Use time range filters
2. Enable data aggregation
3. Limit data points in charts
4. Export instead of viewing all

### Slow Loading

If charts load slowly:

1. Clear browser cache
2. Reduce date range
3. Disable animations in settings
4. Use compact mode

## Accessibility

### Screen Readers

- All charts have text descriptions
- Data tables available as alternatives
- ARIA labels on interactive elements
- Keyboard navigation support

### Color Blindness

- Patterns in addition to colors
- High contrast mode available
- Text labels on all segments
- Never rely on color alone

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `t` | Change time range |
| `e` | Export current view |
| `f` | Focus on filters |
| `r` | Refresh data |
| `?` | Show shortcuts |

## Common Use Cases

### Weekly Review

**Goal:** Assess progress and plan next week

**Steps:**
1. Set time range to "Last 7 days"
2. Review "Applications Over Time"
3. Check "Status Distribution" for updates
4. Export data for records
5. Note patterns and adjust strategy

### Monthly Report

**Goal:** Comprehensive monthly summary

**Steps:**
1. Set custom date range for the month
2. Review all charts
3. Export data as PDF
4. Note key metrics:
   - Total applications submitted
   - Response rate
   - Interviews secured
   - Offers received

### Pipeline Health Check

**Goal:** Quick assessment of job search health

**Steps:**
1. View "Active Applications" metric
2. Check "Status Distribution" pie chart
3. Review "Response Timeline" heatmap
4. Identify bottlenecks
5. Plan follow-ups

## Troubleshooting

### Charts Not Loading

**Causes:**
- No applications in selected range
- Browser compatibility issue
- Data corruption

**Solutions:**
1. Adjust time range
2. Clear browser cache
3. Try different browser
4. Check browser console for errors

### Incorrect Data

**Causes:**
- Stale cache
- Unsynced data
- Timezone issues

**Solutions:**
1. Refresh the page
2. Clear application cache
3. Verify application dates
4. Check timezone settings

### Export Fails

**Causes:**
- Large dataset
- Browser memory limit
- Network issues

**Solutions:**
1. Reduce date range
2. Export in smaller chunks
3. Try CSV instead of PDF
4. Check network connection

## Best Practices

### Regular Reviews

- **Daily:** Quick glance at active applications
- **Weekly:** Full dashboard review
- **Monthly:** Export and analyze trends
- **Quarterly:** Comprehensive strategy adjustment

### Data Quality

- Update applications promptly
- Use consistent status values
- Add detailed notes for context
- Review and clean old data quarterly

### Actionable Insights

Don't just view—act on insights:

- Low response rate? → Improve application materials
- Few interviews? → Target better-matched roles
- Long response times? → Adjust follow-up strategy
- High rejection rate? → Seek feedback, refine approach

## Next Steps

- [MCP Integration](/docs/guides/mcp-integration) - Automate tracking
- [OAuth Setup](/docs/guides/oauth-setup) - Secure your data
- [Contributing](/docs/community/contributing) - Suggest new features

## Technical Details

### Chart Library

Trackr uses [Recharts](https://recharts.org/) for all visualizations:

- Responsive SVG-based charts
- TypeScript support
- Customizable components
- Accessibility features

### Data Aggregation

Charts use server-side aggregation for performance:

```typescript
// Example aggregation query
const analytics = await db
  .select({
    status: applications.status,
    count: sql`count(*)`,
  })
  .from(applications)
  .where(eq(applications.userId, userId))
  .groupBy(applications.status);
```

### Caching Strategy

- Real-time data for current session
- 5-minute cache for aggregated metrics
- Background refresh on navigation
- Manual refresh available
