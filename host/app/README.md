# Version Management Guide

## 📁 Directory Structure

Create the following structure for your application versions:

```
/Project-directory/
└── app/
    ├── 1.0.0/
    │   ├── (your application files)
    ├── 1.1.0/
    │   ├── (updated files)
    ├── 2.0.0/
    │   ├── (new version files)
    └── 2.1.0/
        ├── (latest files)
```

## 🛠️ Creating Versions

### Step 1: Create Version Directory
```bash
# Navigate to your app directory
cd /Project-directory/app

# Create a new version folder
mkdir 2.2.0
```

### Step 2: Add Your Application Files
```bash
# Copy your application files to the version directory
cp -r /path/to/your/application/* 2.2.0/

# Or build directly into the version directory
cd 2.2.0
# Build your application here
```

### Step 3: Verify Structure
Ensure each version folder contains a complete, standalone application

### Example:
```
2.2.0/
├── app-executable          # Main executable
├── config/
│   ├── settings.json
│   └── environment.conf
├── assets/
│   ├── images/
│   ├── sounds/
│   └── data/
├── libs/                   # Dependencies
│   ├── library1.so
│   └── library2.dll
└── README.md              # Version-specific docs
```

## 📋 Version Naming Rules

### Valid Version Formats:
```
1.0.0
2.1.0
3.0.0-beta.1
1.2.3-release
10.5.2
```

### Invalid Version Formats:
```
v1.0.0        # No 'v' prefix
version-1.0   # No dashes in main version
1.0           # Must have at least 3 parts
1.0.0a        # No letters in version parts
```

## 🔄 Version Organization Tips

### 1. Semantic Versioning
Follow semantic versioning principles:
- `MAJOR.MINOR.PATCH` (e.g., `2.1.0`)
- Increment MAJOR for breaking changes
- Increment MINOR for new features
- Increment PATCH for bug fixes

### 2. Pre-release Versions
For testing versions:
```bash
# Create pre-release folders
mkdir 2.2.0-beta.1
mkdir 2.2.0-rc.1
```

### 3. Stable Release Structure
```
app/
├── 1.0.0/          # Initial release
├── 1.1.0/          # Minor update
├── 2.0.0/          # Major rewrite
├── 2.1.0/          # Current stable
└── 2.2.0-beta.1/   # Testing version
```

## 🧪 Testing Your Versions

### 1. Verify Server Detection
```bash
curl http://localhost:3000/versions
```
Should return your versions in descending order.

### 2. Test Download
```bash
curl http://localhost:3000/updates?version=2.2.0 -o test-download.tar.gz

# Verify archive contents
tar -tzf test-download.tar.gz
```

### 3. Check Health Endpoint
```bash
curl http://localhost:3000/health
```

## 🚫 Common Mistakes to Avoid

1. **Don't** use spaces in version names
2. **Don't** put version folders outside the `app/` directory
3. **Don't** use non-numeric characters in main version parts
4. **Don't** forget to include all necessary files in each version
5. **Don't** use inconsistent directory structures between versions

## 📊 Example Version Progression

```
app/
├── 1.0.0/              # Initial release
├── 1.1.0/              # Bug fixes
├── 1.2.0/              # New features
├── 2.0.0/              # Major update (breaking changes)
├── 2.0.1/              # Critical patch
├── 2.1.0/              # Feature update
├── 2.2.0-beta.1/       # Beta testing
├── 2.2.0-rc.1/         # Release candidate
└── 2.2.0/              # Stable release
```

## 🔍 Verification Checklist

After creating a new version, verify:

- [ ] Version folder exists in `app/` directory
- [ ] Version name follows naming conventions
- [ ] All application files are present
- [ ] Server detects the new version (`/versions` endpoint)
- [ ] Download works correctly (`/updates` endpoint)
- [ ] Archive contains expected files and structure

Your versions are now ready for distribution through the OmniUpdate Server!
