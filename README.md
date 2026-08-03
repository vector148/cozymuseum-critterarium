# CozyMuseum

**Current shell version:** `1.2.0`

**Your personal digital museum** — collect, catalog, and display your favorite critters, animals, and plants with a beautiful Liquid Glass interface. A cozy, offline-first sanctuary where all data stays right on your computer.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Buy Me a Coffee](https://img.shields.io/badge/Support-Buy%20Me%20a%20Coffee-ffdd00?logo=buy-me-a-coffee)](https://buymeacoffee.com/Vector148)

---

## What it does

- **4 Vivid Realms** — Organisms are sorted into Animalia, Plantae & Fungi, SAR (Chromista), and Microverse.
- **Scientific Accuracy** — Every species is verified with its real biological classification and taxonomy.
- **Hall of Fame** — Mark critters you've personally encountered in real life, complete with the date and your personal rarity score!
- **Extinct Collections** — A dedicated section to collect ancient, fossilized species.
- **Natural History Media** — Beautiful public domain photography and verified YouTube documentaries.

---

## 🚀 Quick Start (For Non-IT Users)

You don't need to know anything about coding to run this game! Just follow these simple steps to start your museum:

### Step 1: Download the Game
1. Click the green **Code** button at the top of this GitHub page.
2. Select **Download ZIP**.
3. Extract the ZIP file to a folder on your computer (e.g., `C:\CozyMuseum`).

### Step 2: Start the Museum Launcher
We've built an automated launcher that will handle everything for you.
1. Open the extracted folder.
2. Double-click the file named **`CozyMuseum.bat`**.

That's it! 
- If you don't have Node.js (the engine required to run the game), the launcher will automatically download and install it for you (just press "Yes" if Windows asks for permission, then reopen `CozyMuseum.bat` when it's done).
- The launcher will automatically download game files and open your web browser to the Museum. 
- Play and enjoy!

---

## How to Add Animals / Organisms

Your museum database lives in the `database/` folder inside simple Excel files (`animalia.xlsx`, `plantae-fungi.xlsx`, etc.). But you **don't need to type things manually**! 

### Option A — Edit Excel manually (Easiest & Most Popular)
You can always open the files in `database/` (like `animalia.xlsx`) using Excel or Google Sheets. Add a new row below the header, fill in the `scientificName` and `commonName`, and paste a DIRECT image link (ending in `.jpg` or `.png`) into the `coverUrl` column.
> ⚠️ **Warning:** Do NOT paste regular Unsplash page links (like `https://unsplash.com/photos/...`) into Excel. They are web pages, not image files, and will show up as a broken image in the game! To use Unsplash, use Option B, C, or D.

### Option B — Ask ChatGPT, Claude, or Gemini
If you want to add many animals at once without typing, ask a web AI to make a JSON file for you!
**Prompt:**
> *"Generate a JSON array for CozyMuseum. I want 3 ocean animals. Each object must have 'name', 'realmId' (animalia), and 'lifeState' (extant). For the Whale Shark, please also add exactly this Unsplash ID: 'a7T0PQol-6E' into the 'unsplashId' field."*

Save the AI's response to `backup/add-organisms.json`, then open your terminal and run:
```bash
npm run bio -- add --input backup/add-organisms.json --apply
```

### Option C — Use an AI IDE Assistant (Advanced)
If you play around with AI tools like Cursor or Antigravity connected to this folder, you can ask it to do all the heavy lifting:
1. Type `@add-organism` or ask the AI to use the **`add-organism` skill**.
2. Give it a name: *"Use the add-organism skill to add a Lion."*
**Want to pick your own Unsplash picture?** Just drop the link!
> *"Use the add-organism skill to add a Gray Whale, and use this Unsplash photo: https://unsplash.com/photos/a7T0PQol-6E"*

### Option D — Add via Command Line (For Coders)
Open your terminal and type:
```bash
npm run bio -- add --name "Panthera leo" --realm animalia
# To use a specific Unsplash photo, grab the ID from the URL (the part after the last dash)
npm run bio -- add --name "Whale shark" --realm animalia --unsplash-id "a7T0PQol-6E" --apply
```

---

## Free Image Sources for Covers

Your museum only allows **copyright-free** (CC0 / Public Domain) images. Do NOT use images from Pinterest or Google Images randomly.

| Source | How to get the URL |
|--------|--------------------|
| **Unsplash** | Go to [unsplash.com](https://unsplash.com). Copy the link in your browser bar. The AI can use this link directly! |
| **Wikimedia Commons** | Search at [commons.wikimedia.org](https://commons.wikimedia.org). |

---

## 💻 Tech Details (For Developers)

- **Frontend:** React 18 + Vite
- **Backend:** Node.js (Express adapter)
- **Data:** Direct `.xlsx` file parsing
- **CLI Tool:** Run `npm run bio` to see all manual ingestion and taxonomy commands.
- **Production Build:** `npm run build` generates a static read-only snapshot for hosting on Vercel.

### License
Source code is MIT licensed. Catalog media remains governed by its exact source rights.

Want a museum of your own? [Create yours from CozyMuseum on GitHub](https://github.com/vector148/cozymuseum). For a matching collection manager built around games, films, social channels, and music, [explore FourRealm OS v3](https://github.com/vector148/fourrealm-os).
