# Academic Scheduler

A modern, responsive web application for managing academic room schedules and events. Built with Next.js and designed for educational institutions.

## About

This scheduler application is designed for academic institutions to manage room bookings, schedule events, and coordinate resources across different departments. The system provides an intuitive interface for viewing weekly schedules, booking rooms, and managing academic events.

## Owner

**Dr. Afef Najjari**  
Professor of Biology and Computer Science  
Campus Universitaire El Manar, 2092 El Manar, Tunis

## Features

### 🏢 Room Management
- **Multiple Academic Rooms**: Physics, Biology, Mathematics, Chemistry, Genetics, Astronomy, Computer Science, Geology, Ecology, and Robotics
- **Room Selection**: Easy switching between different academic spaces
- **Visual Room Indicators**: Clear identification of available rooms

### 📅 Schedule Management
- **Weekly View**: Comprehensive 7-day schedule display
- **Time Slots**: 8 AM to 8 PM scheduling (12-hour coverage)
- **Interactive Calendar**: Click on time slots to create events
- **Date Navigation**: Navigate between different weeks

### 📝 Event Creation
- **Modal Dialog**: Clean, non-intrusive event creation interface
- **Event Details**: Title, organizer, date, start/end times
- **Color Coding**: Visual event categorization with color options
- **Quick Booking**: Click on scheduler slots for instant event creation

### 🎨 Modern Design
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Orange Theme**: Cohesive color scheme with orange gradients
- **Dark Mode Support**: Automatic theme switching based on system preferences
- **Clean Interface**: Minimalist design focused on usability

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Date Handling**: date-fns library

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scheduler
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Creating Events
1. **Select a Room**: Choose from the available academic rooms
2. **Click "Add Event"**: Use the orange button or click on a time slot
3. **Fill Event Details**: Complete the form in the modal dialog
4. **Submit**: Your event will appear on the schedule

### Navigating the Schedule
- **Week Navigation**: Use the arrow buttons to move between weeks
- **Date Picker**: Click the date picker to jump to specific dates
- **Time Slots**: Click on any hour slot to create an event for that time

### Room Management
- **Room Selection**: Click on any room in the left panel to view its schedule
- **Active Room**: The selected room is highlighted in orange
- **Room Switching**: Switch between rooms to view different schedules

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles and theme
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   ├── Header.tsx     # Navigation header
│   ├── Footer.tsx     # Site footer
│   ├── HomeClient.tsx # Main application logic
│   ├── Rooms.tsx      # Room selection component
│   ├── Scheduler.tsx   # Weekly schedule view
│   ├── EventForm.tsx   # Event creation form
│   └── DatePicker.tsx  # Date selection component
└── lib/               # Utility functions
    └── utils.ts       # Helper utilities
```

## Customization

### Adding New Rooms
Edit `src/components/Rooms.tsx` to add new academic rooms:

```typescript
const defaultRooms: Room[] = [
  { name: "New Room", Icon: YourIcon },
  // ... existing rooms
];
```

### Changing Colors
The application uses a consistent orange theme. To modify colors, update the Tailwind classes in:
- Header/Footer: `from-orange-500 to-orange-600`
- Buttons: `bg-orange-600 hover:bg-orange-700`
- Accents: `text-orange-600`

### Time Range
Modify the schedule hours in `src/components/Scheduler.tsx`:

```typescript
const startHour = 8;  // Start time (24-hour format)
const endHour = 20;   // End time (24-hour format)
```

## Contributing

This project is maintained by Dr. Afef Najjari. For contributions or questions, please contact the project owner.

## License

This project is proprietary software developed for academic use at Campus Universitaire El Manar.

## Contact

**Dr. Afef Najjari**  
Professor of Biology and Computer Science  
Campus Universitaire El Manar  
2092 El Manar, Tunis  
Email: [Contact Information]

---

Built with ❤️ for academic institutions