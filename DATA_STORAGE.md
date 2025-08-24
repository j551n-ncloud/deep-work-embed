# Data Storage Information

## Where Your Data is Saved

All your focus app data is stored locally in your browser's **localStorage**. This means:

### ✅ **Advantages:**
- **Private** - Data never leaves your device
- **Fast** - No network requests needed
- **Offline** - Works without internet
- **Free** - No server costs

### 📍 **Storage Locations:**

#### 1. **Calendar Data** (`focus-calendar`)
- **What:** Daily focus hours for the contribution calendar
- **Format:** `{ "2025-01-15": 2.5, "2025-01-16": 1.0 }`
- **Used by:** Calendar view, Days Locked In counter

#### 2. **Tasks** (`focus-tasks`)
- **What:** Your task list with categories and completion status
- **Format:** Array of task objects with id, title, type, status, dates
- **Used by:** Task sidebar

#### 3. **Session Categories** (`session-{id}-category`)
- **What:** Selected category for each focus session
- **Format:** String like "Code", "Study", or "Design"
- **Used by:** Session tracking

### 🔍 **How to View Your Data:**

1. **Open Browser Developer Tools** (F12)
2. **Go to Application/Storage tab**
3. **Click localStorage**
4. **Find your domain**
5. **See all stored keys**

### ⚠️ **Important Notes:**

- **Browser-specific** - Data is tied to this browser on this device
- **Domain-specific** - Only accessible from your app's domain
- **Clearing browser data** will delete all focus app data
- **Private/Incognito mode** - Data won't persist after closing

### 💾 **Backup Recommendation:**

Since data is local-only, consider occasionally:
- Exporting your calendar data
- Taking screenshots of your progress
- Backing up localStorage if you want to preserve long-term data