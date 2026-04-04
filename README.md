# Interactive Mini Website

A simple 4-page interactive website created with HTML, CSS, and JavaScript.

## Project Structure

```
├── index.html          # Heart intro page
├── puzzle.html         # Image puzzle game
├── letter.html         # Message page
├── questions.html      # Questions page
├── style.css           # All styles and animations
├── script.js           # All JavaScript logic
└── assets/
    ├── puzzle-image.jpg    # Image for the puzzle (REPLACE THIS)
    └── background.jpg      # Background for letter page (REPLACE THIS)
```

## Setup Instructions

### 1. Add Your Images

Before deploying, you need to add two images to the `assets/` folder:

- **puzzle-image.jpg** - This will be split into a 3x3 puzzle. Use a square image (recommended: 600x600px or larger)
- **background.jpg** - Background image for the letter page (any romantic/beautiful image)

### 2. Customize the Content

You can easily customize the text in these files:

**letter.html** - Edit the message:
- Change `[Name]` to the recipient's name
- Change `[Your Name]` to your name
- Modify the message text as desired

**questions.html** - The question and responses can be edited directly in the HTML and JavaScript files.

## How to Deploy on GitHub Pages (FREE)

### Step 1: Create a GitHub Account
1. Go to https://github.com
2. Sign up for a free account if you don't have one

### Step 2: Create a New Repository
1. Click the "+" icon in the top right corner
2. Select "New repository"
3. Name it something like `romantic-website` or any name you prefer
4. Make sure it's set to **Public**
5. Click "Create repository"

### Step 3: Upload Your Files
1. On the repository page, click "uploading an existing file"
2. Drag and drop ALL files from this project:
   - index.html
   - puzzle.html
   - letter.html
   - questions.html
   - style.css
   - script.js
   - assets folder (with your images inside)
3. Click "Commit changes"

### Step 4: Enable GitHub Pages
1. In your repository, click "Settings"
2. Scroll down to "Pages" in the left sidebar
3. Under "Source", select "main" branch
4. Click "Save"
5. Wait 1-2 minutes for deployment

### Step 5: Get Your Link
1. After a minute, refresh the Settings > Pages page
2. You'll see a message: "Your site is published at https://[username].github.io/[repository-name]/"
3. Click the link to view your site
4. Share this link with anyone!

## Alternative: Using Git Command Line

If you're comfortable with Git:

```bash
# Initialize git in your project folder
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/[username]/[repository-name].git

# Push to GitHub
git branch -M main
git push -u origin main
```

Then follow Step 4 above to enable GitHub Pages.

## Customization Tips

### Change Colors
Edit `style.css` and modify the gradient backgrounds:
- `.page-intro` - Heart page colors
- `.page-puzzle` - Puzzle page colors
- `.page-letter` - Letter page colors
- `.page-questions` - Questions page colors

### Change Animations
All animations are in `style.css`:
- `@keyframes pulse` - Heart pulsing effect
- `@keyframes fadeIn` - Page fade in
- `@keyframes bounceIn` - Success message

### Change Puzzle Difficulty
In `script.js`, find the `createPuzzle()` function:
- Currently set to 3x3 (9 pieces)
- To make it harder, change the grid to 4x4 or 5x5
- Update the CSS grid in `style.css` accordingly

### Change Response Messages
In `script.js`, find the `responses` object in `showResponse()` function and edit the messages.

## Testing Locally

To test the website on your computer before deploying:

1. Simply open `index.html` in your web browser
2. Or use a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Then open http://localhost:8000 in your browser
   ```

## Mobile Compatibility

The website is fully responsive and works on:
- Mobile phones (iOS and Android)
- Tablets
- Desktop computers
- All modern browsers

## Troubleshooting

**Images not showing:**
- Make sure image files are in the `assets/` folder
- Check that filenames match exactly: `puzzle-image.jpg` and `background.jpg`
- Images must be JPG format (or update the HTML to match your format)

**Puzzle not working:**
- Ensure `puzzle-image.jpg` exists in the assets folder
- Try using a square image for best results

**Page not redirecting:**
- Check browser console for errors (F12 key)
- Make sure all HTML files are in the same directory

## License

Free to use and customize for personal purposes.

---

**Enjoy your interactive website! 💕**
