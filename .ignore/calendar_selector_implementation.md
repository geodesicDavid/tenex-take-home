# Calendar Selector Implementation

## Overview
Implemented a selector in the CalendarContainer component that allows users to choose how many days in advance to preview events. The selector is positioned in line with the calendar header, and a heavy line separator is added between days in the calendar display.

## Changes Made

### 1. CalendarContainer Component (`apps/web/src/components/layout/CalendarContainer.tsx`)
- Added state to track the number of days to preview (default: 3)
- Created a dropdown selector with options for 1-7 days
- Positioned the selector in line with the calendar header using flexbox
- Added a heavy line separator between the header and the calendar content

### 2. Calendar Service (`apps/web/src/services/calendarService.ts`)
- Modified `getCalendarEvents` function to accept a `daysPreview` parameter
- Updated the API call to use the `days_ahead` query parameter

### 3. Calendar Events Hook (`apps/web/src/hooks/useCalendarEvents.ts`)
- Modified `useCalendarEvents` hook to accept a `daysPreview` parameter
- Updated the hook to pass the parameter to the service function
- Added the parameter to the useEffect dependency array

### 4. Calendar Event List Component (`apps/web/src/components/CalendarEventList.tsx`)
- Added grouping of events by date
- Added date headers for each group of events
- Added heavy line separators between days

## Features
- Dropdown selector with options for 1-7 days (default: 3 days)
- Selector positioned in line with the calendar header
- Heavy line separator between the header and calendar content
- Heavy line separators between days in the calendar display
- Real-time update of calendar events when the selector value changes

## API Integration
- The backend API already supported the `days_ahead` parameter
- No changes were needed to the backend implementation

## Testing
- Verified that the frontend builds correctly (shared package)
- Verified that the calendar selector appears in the UI
- Verified that the API endpoint accepts the `days_ahead` parameter