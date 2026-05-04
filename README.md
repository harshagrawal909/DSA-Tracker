# 📚 DSA Tracker - Complete Learning Path Dashboard

A modern, interactive web application designed to help you track progress through **Striver's A2Z DSA Course** with visual progress indicators, problem tracking, and personal notes management.

---

## ✨ Features

### 📊 Progress Dashboard
- **Real-time Statistics**: Track total progress, video completion rate, and problem-solving progress
- **Visual Progress Bars**: See your advancement with color-coded progress indicators
- **Focus Day Recommendation**: The app intelligently identifies the next incomplete day to keep you on track
- **Day-wise Breakdown**: View detailed stats for videos completed vs. problems solved

### 🗓️ Day-wise Learning Structure
- **61 Days of Curated Content**: Complete DSA learning path organized by day
- **Video Curriculum**: Embedded YouTube video links with duration information
- **Problem Sets**: Curated coding problems from LeetCode and GeeksforGeeks
- **Difficulty Levels**: Problems categorized as Easy, Medium, or Hard

### ✅ Task & Problem Tracking
- **Mark Complete**: Check off videos and problems as you complete them
- **Persistent Storage**: Progress is automatically saved in your browser's local storage
- **Problem Notes**: Write and save personal notes, approaches, and solutions for each problem
- **Quick Links**: Direct links to problem platforms (LeetCode, GeeksforGeeks)

### 🎨 User Experience
- **Dark/Light Mode Toggle**: Comfortable viewing in any lighting condition with theme persistence
- **Responsive Design**: Seamless experience on desktop, tablet, and mobile devices
- **Tailwind CSS Styling**: Modern, clean, and accessible UI design
- **Smooth Animations**: Loading states and transitions for better UX
- **No Authentication Required**: Fully local progress tracking—your data never leaves your device

### 🔧 Data Management
- **Excel Import**: Import course data directly from Excel spreadsheets
- **Auto-generation**: Automatically generates data from `Strivers_A2Z_DSA_Schedule.xlsx`
- **Reset Option**: Clear all progress and notes with a single button (confirmation required)

---

## 🏗️ Project Structure

```
.
├── app/                          # Next.js app directory
│   ├── layout.js                # Root layout with theme provider
│   ├── globals.css              # Global styles and Tailwind imports
│   ├── page.js                  # Home page (dashboard)
│   ├── not-found.js             # 404 page
│   └── day/
│       └── [id]/
│           └── page.js          # Individual day detail page
├── components/                   # React components
│   ├── DashboardClient.js        # Main dashboard (client-side)
│   ├── DayCard.js               # Day preview card component
│   ├── DayView.js               # Day detail view with tasks/problems
│   ├── Header.js                # App header with theme toggle
│   ├── ProgressBar.js           # Progress visualization component
│   ├── ProblemItem.js           # Individual problem component
│   ├── TaskItem.js              # Video task component
│   └── ThemeProvider.js         # Theme context provider
├── lib/                          # Utility functions
│   └── storage.js               # LocalStorage management for completions & notes
├── scripts/                      # Build & utility scripts
│   └── build-data-from-xlsx.js  # Excel to JavaScript converter
├── data.js                       # Auto-generated DSA course data
├── package.json                 # Dependencies and scripts
├── next.config.mjs              # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.mjs           # PostCSS configuration
├── jsconfig.json                # JavaScript path aliases
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or higher
- **npm** or **yarn**: For package management
- **Git**: For version control (optional)

### Installation

1. **Clone or Download the Repository**
   ```bash
   git clone <repository-url>
   cd dsa-tracker
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

### Optional: Import Data from Excel

If you have the Excel file `Strivers_A2Z_DSA_Schedule.xlsx` in the project root:

```bash
npm run data:import
```

This will:
- Read the Excel spreadsheet
- Parse video schedules and problem sets
- Generate `data.js` with all course information
- Auto-generate problem links for LeetCode problems

---

## 💻 Usage Guide

### Dashboard View
1. **Open the Application**: Navigate to `http://localhost:3000`
2. **View Overall Progress**: See statistics for:
   - Total items completed vs. total items
   - Video completion percentage
   - Problem completion percentage
   - Suggested focus day

3. **Browse Days**: Scroll through the day cards showing:
   - Day number and date range
   - Video count and status
   - Problem count and status

### Day Detail View
1. **Click on a Day Card**: Opens the detailed view for that specific day
2. **Watch Videos**: 
   - See embedded video duration
   - Click links to watch on YouTube
   - Mark videos as complete when finished
3. **Solve Problems**:
   - View problem title, difficulty, and platform
   - Click to open the problem on LeetCode/GeeksforGeeks
   - Write and save your approach/solution notes
   - Mark problems as complete when solved

### Managing Progress
- **Check Off Tasks**: Click checkboxes to mark items complete
- **Take Notes**: Click "Add Notes" or "Edit Notes" on any problem
- **Toggle Theme**: Use the header button to switch between light and dark mode
- **Reset Progress**: Use the reset button (⚠️ this clears all data)

---

## 🛠️ Technology Stack

### Frontend
- **React 18.3**: User interface and component management
- **Next.js 14.2**: Full-stack web framework with routing and optimization
- **Tailwind CSS 3.4**: Utility-first CSS framework for styling
- **PostCSS**: CSS transformation and autoprefixing

### Data & Storage
- **JavaScript Objects**: Course data structure
- **LocalStorage API**: Client-side progress persistence
- **XLSX Library**: Excel file parsing (dev dependency)

### Development Tools
- **ESLint**: Code quality and style checking
- **Autoprefixer**: Automatic CSS vendor prefixing

---

## 📝 Scripts Reference

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint code quality checks |
| `npm run data:import` | Import DSA data from Excel spreadsheet |

---

## 💾 Data Management

### LocalStorage Keys
The application uses the following localStorage keys to persist data:

- **`dsa-tracker-completions`**: Stores task and problem completion status
- **`dsa-tracker-problem-notes`**: Stores personal notes for each problem
- **`dsa-tracker-theme`**: Stores light/dark theme preference

### Resetting Data
⚠️ **Warning**: This action cannot be undone.

Click the reset button in the dashboard to clear all progress and notes. You'll be prompted for confirmation before data is cleared.

---

## 📊 Course Structure

The course consists of **61 days** of structured learning:

### Each Day Contains:
1. **Video Tutorials**: Lectures and concepts explanations
   - Links to YouTube videos
   - Duration information
   - Foundational and advanced topics

2. **Coding Problems**: Practice exercises
   - Problem title and ID
   - Difficulty level (Easy/Medium/Hard)
   - Platform (LeetCode/GeeksforGeeks)
   - Direct problem links
   - Space for personal notes and approaches

### Topics Covered (Examples):
- C++ Basics and Setup
- Time and Space Complexity
- Pattern Problems
- Arrays and Hashing
- Linked Lists
- Stacks and Queues
- Recursion and Backtracking
- Sorting and Searching
- Dynamic Programming
- Graphs and Trees
- And much more...

---

## 🎯 How to Use Effectively

### 1. **Daily Learning Routine**
   - Check the "Focus Day" recommendation
   - Watch videos in order
   - Solve all problems in the day
   - Mark items as complete
   - Write notes on your approach

### 2. **Take Good Notes**
   - Document your problem-solving approach
   - Write edge cases you discover
   - Note important patterns or algorithms
   - These notes are searchable for future reference

### 3. **Track Progress**
   - Monitor your overall percentage
   - Notice which topics take more time
   - Review incomplete days regularly
   - Celebrate milestones (25%, 50%, 75%, 100%)

### 4. **Practice Efficiently**
   - Don't skip videos—they build fundamentals
   - Solve problems before looking at solutions
   - Revisit difficult problems later
   - Time yourself on easy problems

---

## 🔧 Configuration

### Tailwind CSS
Customize styles in `tailwind.config.js`:
- Color schemes
- Spacing and sizing
- Font configurations
- Dark mode settings

### Next.js
Modify app behavior in `next.config.mjs`:
- Image optimization
- Build settings
- Runtime features

### Path Aliases
JavaScript shortcuts are configured in `jsconfig.json`:
- `@/components` → `./components`
- `@/lib` → `./lib`
- `@/app` → `./app`

---

## 🚨 Troubleshooting

### Issues & Solutions

| Issue | Solution |
|-------|----------|
| Progress not saving | Check browser localStorage is enabled |
| Data not importing | Ensure Excel file is in project root with correct name |
| Styles not loading | Clear cache and restart dev server: `npm run dev` |
| Theme not persisting | Check browser localStorage settings |
| Videos not loading | Check YouTube links are accessible in your region |

---

## 📱 Browser Support

- ✅ Chrome/Edge (latest versions)
- ✅ Firefox (latest versions)
- ✅ Safari (latest versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Note**: LocalStorage must be enabled for progress tracking to work.

---

## 📚 Resources

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Striver's YouTube Channel](https://www.youtube.com/@take_u_forward)

### Related Tools
- [LeetCode](https://leetcode.com)
- [GeeksforGeeks](https://www.geeksforgeeks.org)
- [VS Code](https://code.visualstudio.com)

---

## 🤝 Contributing

This is a personal learning tracker project. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ⚖️ License

This project is provided as-is for educational purposes. The course content references Striver's A2Z DSA Course.

---

## 📞 Support & Feedback

- **Report Issues**: Create an issue in the repository
- **Suggestions**: Feel free to suggest features or improvements
- **Questions**: Check existing issues or documentation first

---

## 🎓 Acknowledgments

- **Striver** (@takeuforward) for the comprehensive DSA curriculum
- **Next.js Team** for the excellent web framework
- **React Community** for the UI library
- **Tailwind Labs** for the CSS framework

---

## 📈 Roadmap

Future enhancements planned:
- [ ] Export progress as PDF
- [ ] Problem difficulty filter and search
- [ ] Spaced repetition reminders
- [ ] Problem solution reviews
- [ ] Time tracking for each problem
- [ ] Community discussions
- [ ] Performance analytics

---

**Made with ❤️ for DSA learners**

Happy Learning! 🚀
