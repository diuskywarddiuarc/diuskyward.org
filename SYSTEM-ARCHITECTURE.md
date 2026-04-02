## DIU Skyward Website – System Architecture & Content Map

This document describes the **technical architecture** of the DIU Skyward Official site and **where each piece of on-screen text is defined** in the codebase.

The sections below use dropdowns (`<details>`/`<summary>`) so you can expand only what you need.

---

<details>
<summary><strong>1. Tech Stack & Global Layout</strong></summary>

- **Framework**
  - **Next.js App Router** (`"next": "16.1.6"`) with **TypeScript** and **React 19**.
  - Located under `src/app/...` (each route has its own `page.tsx`).

- **Global Layout**
  - **File**: `src/app/layout.tsx`
  - **Responsibility**:
    - Sets the HTML shell and `<body>` classes (global background, typography, flex layout).
    - Injects the **global navigation** and **footer**.
  - **Key structure**:
    - `<Navbar />` at the top (imported from `@/components/Navbar`).
    - `<main>` wraps route-level content (`{children}`).
    - `<Footer />` at the bottom (imported from `@/components/Footer`).
  - **SEO / Metadata text**:
    - `title`: **"DIU Skyward | Aerospace Program"**
    - `description`: **"DIU Skyward is a student-led aerospace engineering initiative focused on rockets, satellites and robotics."**
    - `openGraph.title`: **"DIU Skyward Aerospace Program"**
    - `openGraph.description`: **"Rocket and Satellite Research Initiative"**

- **Global Styling**
  - Tailwind CSS v4 with custom color tokens (e.g. `bg-rl-black`, `text-rl-white`).
  - Global CSS entry: `src/app/globals.css` (not inspected here but referenced in `layout.tsx`).

</details>

---

<details>
<summary><strong>2. Navigation & Footer – Site-wide Text</strong></summary>

### 2.1 Navbar

- **File**: `src/components/Navbar.tsx`
- **Where it appears**: Every page (injected via `RootLayout`).
- **Key responsibilities**:
  - Shows the DIU Skyward logo (`/media/images/nav-logo.png`).
  - Provides primary navigation links.
  - Responsive behavior (desktop links + mobile drawer).
- **Visible text & routes**:
  - Logo alt text: **"DIU SKYWARD"**
  - Top nav links (`NAV_LINKS`):
    - **"About"** → `/who-we-are`
    - **"Engineering"** → `/what-we-do`
    - **"Programs"** → `/programs`
    - **"Missions"** → `/missions`
    - **"Updates"** → `/news`
  - Call-to-action button (desktop & mobile):
    - **"Careers / Join"** → `/join`
  - Mobile drawer repeats the same labels, plus a full-width **"Careers / Join"** button.

### 2.2 Footer

- **File**: `src/components/Footer.tsx`
- **Where it appears**: Every page (via `RootLayout`).
- **Sections & text**:
  - **Brand column**
    - Logo image: `/media/images/footer-logo.png`
    - Alt text: **"DIU SKYWARD"**
    - Description paragraph:
      - **"Daffodil International University&apos;s advanced student-led aerospace engineering initiative."**
  - **Site map – "DISCOVER"**
    - Heading: **"DISCOVER"**
    - Links:
      - **"About"** → `/who-we-are`
      - **"Programs"** → `/programs`
      - **"Missions"** → `/missions`
  - **Contact information – "CONTACT"**
    - Heading: **"CONTACT"**
    - Address block:
      - **"Daffodil Smart City, Birulia"**  
        **"Savar, Dhaka-1216"**  
        **"Bangladesh"**
    - Email:
      - **"contact@skyward.diu.edu.bd"** (`mailto:` link)
  - **Connect & careers – "CONNECT"**
    - Heading: **"CONNECT"**
    - Social placeholders:
      - **"IN"**, **"FB"**, **"YT"** (all `href="#"` currently)
    - Careers button:
      - **"CAREERS"** → `/join`
  - **Bottom bar**
    - Copyright:
      - **"© {currentYear} DIU Skyward. All Rights Reserved."**
    - Policy links:
      - **"Privacy Policy"** → `/privacy`
      - **"Terms"** → `/terms`

</details>

---

<details>
<summary><strong>3. Home Page (<code>/</code>) – Layout & Text</strong></summary>

- **File**: `src/app/page.tsx`
- **Main layout**:
  - Uses `<Hero />` (full-screen video hero with countdown).
  - Several vertically stacked sections:
    1. About / overview
    2. Programs feature image
    3. Latest missions card grid
    4. Sponsors marquee
    5. Crowdfunding CTA
    6. Join CTA
    7. Hidden easter-egg hint

### 3.1 Hero (Home)

- **File**: `src/components/Hero.tsx`
- **Background**: Video `/media/videos/hero-rocket.mp4` with subtle overlay.
- **Key UI elements**:
  - Launch countdown labeled `T-` plus units:
    - Labels text:
      - **"Days"**, **"Hours"**, **"Mins"**, **"Secs"**
  - Primary CTA button:
    - Label: **"WATCH MISSION"** → `/missions`

### 3.2 About section – "PIONEERING STUDENT AEROSPACE"

- **File**: `src/app/page.tsx` (About section markup)
- **Key text**:
  - Section heading:
    - **"PIONEERING STUDENT AEROSPACE"**
  - Paragraph:
    - **"DIU Skyward is the first student-driven flagship engineering initiative at Daffodil International University. We are dedicated to the research, design, and development of experimental rockets, satellites, and autonomous robotics."**
  - Link CTA:
    - **"LEARN MORE"** → `/who-we-are`
  - Three info tiles:
    - Tile 1:
      - Heading: **"EST. 2025"**
      - Copy: **"Founded at Daffodil International University to bridge the gap between classroom theory and orbital mechanics."**
    - Tile 2:
      - Heading: **"MISSIONS"**
      - Copy: **"Executing suborbital launches, CanSat deployments, and Mars-analog rover tests."**
    - Tile 3:
      - Heading: **"HARDWARE"**
      - Copy: **"In-house manufacturing of composite airframes, solid propulsion systems, and flight telemetry computers."**

### 3.3 Programs teaser – "ENGINEERING PROGRAMS"

- **File**: `src/app/page.tsx`
- **Section text**:
  - Heading: **"ENGINEERING PROGRAMS"**
  - Subheading: **"From suborbital sounding rockets to autonomous planetary rovers."**
  - Button:
    - **"EXPLORE PROGRAMS"** → `/programs`

### 3.4 Latest Missions card grid

- **Wrapper file**: `src/app/page.tsx`
- **Card component**: `src/components/Card.tsx`
- **Section header text**:
  - Heading: **"LATEST MISSIONS"**
  - Link: **"ALL MISSIONS"** → `/missions`
- **Individual cards (configured in `page.tsx`)**:
  1. Card 1
     - `href`: `/programs/rocket`
     - `title`: **"NT-01 STATIC FIRE"**
     - `description`: **"Successful full-duration test of our custom solid propellant motor."**
     - `category`: **"TESTING"**
  2. Card 2
     - `href`: `/programs/cansat`
     - `title`: **"Coming Soon: CANSAT DEPLOYMENT"**
     - `description`: **"High-altitude payload drop testing telemetry acquisition."**
     - `category`: **"LAUNCH"**
  3. Card 3
     - `href`: `/programs/rover`
     - `title`: **"Coming Soon: ROVER CHASSIS V1"**
     - `description`: **"Machining the new aluminum rocker-bogie suspension system."**
     - `category`: **"MANUFACTURING"**

### 3.5 Sponsors marquee – "SPONSORS & PARTNERS"

- **File**: `src/app/page.tsx`
- **Section heading**:
  - **"SPONSORS & PARTNERS"**
- **Sponsors array (`SPONSORS`)**:
  - Names: **"SpaceX"**, **"NASA"**, **"Rocket Lab"**, **"Airbus"**, **"Northrop Grumman"**, **"Boeing"**
  - Rendered with emojis in a scrolling marquee.

### 3.6 Crowdfunding CTA – "SUPPORT THE MISSION"

- **File**: `src/app/page.tsx`
- **Text**:
  - Heading: **"SUPPORT THE MISSION"**
  - Body:
    - **"Directly fund our research in high-power rocketry and satellite deployment. Your contributions go directly towards hardware, propellant, and laboratory equipment."**
  - Button:
    - **"CROWDFUND US"** → `/crowdfund`

### 3.7 Join CTA – "JOIN THE INITIATIVE"

- **File**: `src/app/page.tsx`
- **Text**:
  - Heading: **"JOIN THE INITIATIVE"**
  - Body:
    - **"We are actively recruiting passionate engineers and innovators. Push your limits."**
  - Button:
    - **"APPLY NOW"** → `/join`

### 3.8 Easter egg hint – `terminal_id: blaster`

- **File**: `src/app/page.tsx`
- **Content** (very small, low-opacity footnote):
  - **"terminal_id: blaster"**
- **Related component**: `src/components/BlasterGame.tsx`
  - Game UI text includes:
    - Title: **"BLASTER_MOD_V1"**
    - Score label: **"Score: {score}"**
    - Game over panel: **"MISSION FAILED"**, **"Final Score: {score}"**, **"Restart"**
    - Instructions: **"Arow Keys to move"**, **"Space to fire"**
    - Close button: **"Close [Esc]"**

</details>

---

<details>
<summary><strong>4. Content Pages – About, Engineering, Programs, Missions, News</strong></summary>

### 4.1 About – "WHO WE ARE" (`/who-we-are`)

- **File**: `src/app/who-we-are/page.tsx`
- **Hero section**:
  - Heading: **"WHO WE ARE"**
  - Subheading: **"Engineering The Future."**

- **History block**:
  - Section heading: **"HISTORY"**
  - Paragraphs:
    - **"Founded in 2025 at Daffodil International University, Skyward began as a small group of ambitious engineering students looking beyond the classroom. What started as theoretical design evolved into a fully-fledged research organization."**
    - **"Today, we represent the peak of undergraduate engineering capability, actively developing high-power rocketry and autonomous systems."**

- **Mission / Vision cards**:
  - Card 1:
    - Heading: **"MISSION"**
    - Text:
      - **"To engineer, manufacture, and fly advanced aerospace systems while providing students with unparalleled hands-on experience in complex, interdisciplinary project management."**
  - Card 2:
    - Heading: **"VISION"**
    - Text:
      - **"To become a leading university-level aerospace research center in South Asia, ultimately deploying student-built artifacts into Low Earth Orbit (LEO) and beyond."**

- **Structure section**:
  - Section heading: **"STRUCTURE"**
  - Subdivisions grid:
    - **"Rocket Div"**
    - **"Satellite Div"**
    - **"Robotics Div"**
    - **"Research Div"**

- **Executive Leadership**:
  - Heading: **"EXECUTIVE LEADERSHIP"**
  - Data stored in `TEAM_MEMBERS` array (name + title pairs), such as:
    - **"John Doe – Founder & Chief Engineer"**
    - **"Jane Smith – Chief Operations Officer"**
    - …etc. (see `TEAM_MEMBERS` in file for full list)

- **Faculty Mentors**:
  - Heading: **"FACULTY MENTORS"**
  - Data array `MENTORS`, e.g.:
    - **"Dr. Lutfar Rahman – Faculty Mentor, DIU"**
    - **"Prof. Dr. Syed Akhter Hossain – Research Mentor"**
    - **"Dr. Touhid Bhuiyan – Technical Guide"**
    - **"Mr. Nadim Ahmed – Project Consultant"**

- **Advisory Panel**:
  - Heading: **"ADVISORY PANEL"**
  - Data array `ADVISORY_PANEL`, e.g.:
    - **"Dr. Robert Zubrin – Mars Society President"**
    - **"Elon Musk – Technical Advisor (Honorary)"**
    - **"Gwynne Shotwell – Strategic Advisor"**
    - **"Peter Beck – Launch Systems Advisor"**

- **Bottom CTA**:
  - Button text: **"JOIN THE TEAM"** → `/join`

---

### 4.2 Engineering – "CAPABILITIES" (`/what-we-do`)

- **File**: `src/app/what-we-do/page.tsx`
- **Hero**:
  - Small label: **"Design & Engineering"**
  - Heading: **"CAPABILITIES"**

- **Engineering focus areas** (from `areas` array):
  - Each area renders:
    - A numbered index (`01`, `02`, …)
    - Title + descriptive paragraph
    - CTA: **"EXPLORE PROGRAMS"** → `/programs`
  - Area titles:
    1. **"ROCKET PROPULSION"**
    2. **"AVIONICS & TELEMETRY"**
    3. **"SATELLITE SYSTEMS"**
    4. **"AUTONOMOUS ROBOTICS"**
    5. **"RESEARCH & SIMULATION"**
  - Descriptions are multi-sentence technical blurbs (see `areas` array for full copy).

---

### 4.3 Programs index – "PROGRAMS" (`/programs`)

- **File**: `src/app/programs/page.tsx`
- **Hero**:
  - Small label: **"Initiatives"**
  - Heading: **"PROGRAMS"**

- **Program cards** (using `Card` component):
  1. **ROCKET ENGINEERING**
     - `href`: `/programs/rocket`
     - `category`: **"SUBORBITAL"**
     - `description`:  
       **"Design, manufacturing, and flight testing of experimental high-power sounding rockets. Focus on custom solid motors, composite airframes, and dual-deploy recovery systems."**
  2. **CANSAT SIMULATOR**
     - `href`: `/programs/cansat`
     - `category`: **"TELEMETRY"**
     - `description`:  
       **"Developing volume-constrained payloads (soda can sized) that are launched via rocket or drone to collect atmospheric telemetry and validate descent control algorithms."**
  3. **CUBESAT DEVELOPMENT**
     - `href`: `/programs/cubesat`
     - `category`: **"ORBITAL"**
     - `description`:  
       **"Engineering 1U to 3U nanosatellites utilizing standardized forms for LEO deployment. Focusing on extreme environment survivability and EPS (Electrical Power Systems)."**
  4. **AUTONOMOUS ROVER**
     - `href`: `/programs/rover`
     - `category`: **"ROBOTICS"**
     - `description`:  
       **"Prototyping automated ground vehicles for simulated extraterrestrial terrain navigation, utilizing advanced computer vision, LIDAR mapping, and robotic sample caching."**

---

### 4.4 Missions index – "MISSIONS" (`/missions`)

- **File**: `src/app/missions/page.tsx`
- **Hero**:
  - Small label: **"Operations"**
  - Heading: **"MISSIONS"**

- **Active missions** section:
  - Section title: **"ACTIVE MISSIONS"**
  - Cards:
    1. `/missions/rocket-test-1`
       - Title: **"ROCKET TEST FLIGHT - SR-1"**
       - Category: **"UPCOMING LAUNCH"**
       - Description:  
         **"Maiden suborbital test flight aimed at validating solid propulsion performance and aerodynamic stability at transonic speeds."**
    2. `/missions/cansat-alpha`
       - Title: **"CANSAT ALPHA DROP"**
       - Category: **"UPCOMING TEST"**
       - Description:  
         **"High-altitude drone drop to test primary telemetry acquisition systems, barometric sensors, and parachute descent rates."**

- **Past missions** section:
  - Heading: **"PAST MISSIONS"**
  - Cards:
    1. `/missions/static-fire-1`
       - Title: **"STATIC FIRE TEST #1"**
       - Category: **"COMPLETED"**
       - Description:  
         **"Successful ground testing of custom KN03/Sugar solid propellant mix, measuring specific impulse and thrust curves."**
    2. `/missions/avionics-test`
       - Title: **"AVIONICS HIGH ALT BALLOON"**
       - Category: **"COMPLETED"**
       - Description:  
         **"Weather balloon launch to 30km exposing the custom flight computer PCB to near-space thermal vacuum conditions."**
    3. `/missions/rover-prototype`
       - Title: **"ROVER CHASSIS VAL"**
       - Category: **"COMPLETED"**
       - Description:  
         **"Initial mobility validation of the 6-wheel rocker-bogie suspension system on uneven sandy terrain analogs."**

---

### 4.5 News index – "NEWS" (`/news`)

- **File**: `src/app/news/page.tsx`
- **Hero**:
  - Small label: **"Updates"**
  - Heading: **"NEWS"**

- **News items** (from `ALL_NEWS_ITEMS` array):
  - Each renders as a `Card` with:
    - `href` to a detailed article page.
    - `title`, `description`, `category`.
  - Entries:
    1. `/news/sr1-static-fire-success`
       - Title: **"SR-1 STATIC FIRE A RESOUNDING SUCCESS"**
       - Description:  
         **"The propulsion team successfully completed the full-duration static fire of the SR-1 solid motor, achieving a peak thrust of 1.2kN."**
       - Category: **"TESTING"**
    2. `/news/cansat-competition-2026`
       - Title: **"SKYWARD QUALIFIES FOR CANSAT COMPETITION"**
       - Description:  
         **"Our telemetry division has officially passed the Critical Design Review (CDR) phase for the upcoming 2026 National CanSat Competition."**
       - Category: **"COMPETITION"**
    3. `/news/new-rover-chassis`
       - Title: **"UNVEILING THE MARK II ROVER CHASSIS"**
       - Description:  
         **"The robotics team presents the newly machined aluminum 6-wheel rocker-bogie suspension system designed for extraterrestrial analog environments."**
       - Category: **"HARDWARE"**
    4. `/news/recruitment-drive-sp26`
       - Title: **"SPRING 2026 RECRUITMENT DRIVE OPENS"**
       - Description:  
         **"Applications are now open for students across all engineering disciplines to join the DIU Skyward initiative for the upcoming semester."**
       - Category: **"ANNOUNCEMENT"**
    5. `/news/avionics-pcb-v3`
       - Title: **"AVIONICS BOARD V3 MANUFACTURED"**
       - Description:  
         **"The new deeply miniaturized flight controller has arrived from fabrication, featuring redundant altimeters and enhanced thermal protection."**
       - Category: **"HARDWARE"**
    6. `/news/university-grant-secured`
       - Title: **"UNIVERSITY RESEARCH GRANT SECURED"**
       - Description:  
         **"DIU Skyward has been awarded a core faculty research grant to expand composite material testing for upcoming suborbital missions."**
       - Category: **"FUNDING"**
    7. `/news/inaugural-symposium`
       - Title: **"INAUGURAL AEROSPACE SYMPOSIUM"**
       - Description:  
         **"The team hosted the first university-wide symposium demonstrating rocketry principles to incoming freshmen, boosting program visibility."**
       - Category: **"EVENTS"**

- **Load more button**:
  - Text: **"LOAD OLDER STORIES"**
  - Logic: increases `visibleCount` to reveal additional items from `ALL_NEWS_ITEMS`.

</details>

---

<details>
<summary><strong>5. Forms & Interaction Pages – Join, Contact, Crowdfund</strong></summary>

### 5.1 Join – Application Form (`/join`)

- **File**: `src/app/join/page.tsx`
- **Hero**:
  - Label: **"Recruitment"**
  - Heading: **"JOIN SKYWARD"**

- **Success state text**:
  - Title: **"APPLICATION RECEIVED"**
  - Body:  
    **"Thank you for your interest in DIU Skyward. Our recruiting team will review your profile and contact you shortly."**
  - Link button: **"Submit Another Application"**

- **Form fields & labels**:
  - **"Full Name"** – placeholder: **"JOHN DOE"**
  - **"Student ID"** – placeholder: **"XXX-XX-XXXX"**
  - **"Department"** – select options:
    - **"Software Engineering (SWE)"**
    - **"Computer Science (CSE)"**
    - **"Electrical Engineering (EEE)"**
    - **"Mechatronics (MTE)"**
    - **"Other"**
  - **"Target Division"** – select options:
    - **"Propulsion & Aerodynamics"**
    - **"Avionics & Telemetry"**
    - **"Flight Software"**
    - **"Robotics & Rovers"**
    - **"Media & Communications"**
  - **"Why do you want to join?"** – textarea, placeholder:  
    **"Briefly describe your interest and any relevant experience..."**

- **Buttons & status text**:
  - Submit button (idle): **"SUBMIT APPLICATION"**
  - Submit button (loading): **"PROCESSING..."**
  - Error alert prefix: **"Error:"** (full message from backend is appended).

- **API endpoint**:
  - Submits JSON to `POST /api/join` with `formData`.

---

### 5.2 Contact – General Enquiries (`/contact`)

- **File**: `src/app/contact/page.tsx`
- **Hero**:
  - Label: **"Connect"**
  - Heading: **"CONTACT"**

- **Contact details** (left column):
  - Section heading: **"DETAILS"**
  - **Headquarters** block:
    - Heading: **"Headquarters"**
    - Address (same as footer, but repeated):
      - **"Daffodil Smart City, Birulia"**  
        **"Savar, Dhaka-1216"**  
        **"Bangladesh"**
  - **Email** block:
    - Heading: **"Email"**
    - Links:
      - **"contact@skyward.diu.edu.bd"**
      - **"sponsorship@skyward.diu.edu.bd"**
  - **Phone** block:
    - Heading: **"Phone"**
    - Text:
      - **"+880 1XXX-XXXXXX (General)"** (with `(General)` in lighter opacity)

- **Map placeholder card**:
  - Overlay text:
    - **"VIEW ON MAP"**

- **Contact form** (right column):
  - Section heading: **"MESSAGE"**
  - Fields:
    - **"Full Name"** – placeholder: **"John Doe"**
    - **"Email Address"** – placeholder: **"john@example.com"**
    - **"Subject"** – placeholder: **"General Inquiry"**
    - **"Message"** – placeholder: **"How can we help?"**
  - Error alert:
    - Displays `error` string from state.
  - Submit button:
    - Idle: **"SEND MESSAGE"**
    - Loading: **"SENDING..."**

- **Success state**:
  - Icon + text:
    - Title: **"MESSAGE SENT"**
    - Body: **"We have received your message and will get back to you soon."**
  - Link button: **"Send Another Message"**

- **API endpoint**:
  - Submits JSON to `POST /api/contact` with `formData`.

---

### 5.3 Crowdfund – "SUPPORT THE MISSION" (`/crowdfund`)

- **File**: `src/app/crowdfund/page.tsx`
- **Top navigation**:
  - Back link: **"Back to Home"** → `/`

- **Hero-style intro**:
  - Heading: **"SUPPORT THE MISSION"**
  - Body:  
    **"Your contribution directly funds the development of next-generation aerospace technology at DIU Skyward."**

- **QR section**:
  - Panel text:
    - **"Scan to Pay"**
    - **"Scan this QR with your preferred payment app"**
  - Image:
    - `/media/images/qr-crowdfund.png`

- **Supported methods** (from `PAYMENT_METHODS` array):
  - Heading: **"SUPPORTED METHODS"**
  - Items:
    - **"bKash – Mobile Wallet"**
    - **"Nagad – Mobile Wallet"**
    - **"Rocket – Mobile Wallet"**
    - **"Upay – Mobile Wallet"**
    - **"GPay – Digital Wallet"**

- **Why support us?** section:
  - Heading: **"WHY SUPPORT US?"**
  - Bullets:
    - **"Procurement of high-precision aerospace components."**
    - **"Funding for international aerospace competitions and certifications."**
    - **"Upgrading our test facilities and composites lab."**

- **Secure payment note**:
  - Text:
    - **"All transactions are processed securely via official payment gateways."**
    - **"For custom institutional sponsorships, please contact us at skyward@daffodilvarsity.edu.bd"**

</details>

---

<details>
<summary><strong>6. Program Detail – Rocket Engineering (Project AEROS)</strong></summary>

- **Route**: `/programs/rocket`
- **File**: `src/app/programs/rocket/page.tsx`

### 6.1 Sub-navigation

- Text:
  - **"← All Programs"** → `/programs`
  - **"Rocket Engineering"** (current section label)

### 6.2 Hero

- Label: **"Suborbital Systems"**
- Title: **"PROJECT AEROS"** (rendered as two-line `PROJECT` / `AEROS`)

### 6.3 Overview

- Headline:
  - **"High-Power Suborbital Vehicle"** (stacked lines)
- Descriptive paragraph:
  - **"The Rocket Engineering division is the premier suborbital systems laboratory at DIU. Project AEROS represents our flagship line of high-power sounding rockets designed to deliver 3kg payloads to an apogee of 10,000 feet."**
- Metrics:
  - **"10k"** – **"Target Apogee (ft)"**
  - **"Mach 1.2"** – **"Target Velocity"**

### 6.4 Vehicle Architecture

- Section heading:
  - **"Vehicle Architecture"**
- Subsystems:
  1. **"PROPULSION"**
     - Description:  
       **"Custom solid-propellant motor utilizing Ammonium Perchlorate Composite Propellant (APCP) to ensure precise impulse delivery and stable combustion geometry."**
  2. **"AIRFRAME"**
     - Description:  
       **"Fabricated primarily from lightweight carbon-fiber and fiberglass composites. Aerodynamic surfaces machined from aerospace-grade aluminum."**
  3. **"RECOVERY"**
     - Description:  
       **"Dual-deployment parachute system controlled by redundant flight computers (altimeters) triggering apogee and main deployment charges."**

### 6.5 Join Project CTA

- Section:
  - Icon + Heading: **"Join Project Aeros"**
  - Body:  
    **"We are actively seeking propulsion engineers, composite fabricators, and systems integration specialists to construct our next vehicle."**
  - Button:
    - **"APPLY TO DIVISION"** → `/join`

</details>

---

<details>
<summary><strong>7. Shared Components – Behavior & Text Locations</strong></summary>

### 7.1 `Card` component

- **File**: `src/components/Card.tsx`
- **Usage**:
  - Programs, Missions, News, and Home sections use this component.
- **Props that carry text**:
  - `href`: link destination.
  - `title`: main headline.
  - `description`: body copy (1–3 sentences).
  - `category`: small label above title (optional, uppercase).
  - Internally, a standard footer row always displays:
    - **"LEARN MORE"** with arrow icon.

### 7.2 `Countdown` component

- **File**: `src/components/Countdown.tsx`
- **Usage**:
  - Generic countdown widget (not wired on home hero; that hero has its own internal timer).
- **Text in UI**:
  - Labels:
    - **"Days"**, **"Hours"**, **"Mins"**, **"Secs"**

### 7.3 `BlasterGame` component

- **File**: `src/components/BlasterGame.tsx`
- **Trigger**:
  - Secret keyboard sequence **"blaster"** typed anywhere on home page.
- **UI text**:
  - Overlay title: **"BLASTER_MOD_V1"**
  - Score label: **"Score: {score}"**
  - Close button: **"Close [Esc]"**
  - Game-over modal:
    - Heading: **"MISSION FAILED"**
    - Subtext: **"Final Score: {score}"**
    - Button: **"Restart"**
  - Controls hint:
    - **"Arow Keys to move"**
    - **"Space to fire"**

</details>

---

<details>
<summary><strong>8. Quick Reference – Where to Edit Text</strong></summary>

- **Home page copy & hero labels**
  - Edit in: `src/app/page.tsx` and `src/components/Hero.tsx`

- **Site-wide navigation labels**
  - Top nav & mobile menu: `src/components/Navbar.tsx` (`NAV_LINKS` array + "Careers / Join" button).

- **Footer text (address, contact, careers, policies)**
  - Edit in: `src/components/Footer.tsx`

- **About / Who We Are content**
  - Edit in: `src/app/who-we-are/page.tsx`
  - Arrays: `TEAM_MEMBERS`, `MENTORS`, `ADVISORY_PANEL`

- **Engineering capabilities descriptions**
  - Edit in: `src/app/what-we-do/page.tsx` (`areas` array).

- **Programs card titles & descriptions**
  - Edit in: `src/app/programs/page.tsx`

- **Rocket program long-form copy**
  - Edit in: `src/app/programs/rocket/page.tsx`

- **Missions lists (active / past)**
  - Edit in: `src/app/missions/page.tsx`

- **News items & categories**
  - Edit in: `src/app/news/page.tsx` (`ALL_NEWS_ITEMS` array).

- **Join / recruitment form labels & success text**
  - Edit in: `src/app/join/page.tsx`
  - Backend endpoint: `POST /api/join`

- **Contact page form labels & static contact info**
  - Edit in: `src/app/contact/page.tsx`
  - Backend endpoint: `POST /api/contact`

- **Crowdfunding instructions & payment methods**
  - Edit in: `src/app/crowdfund/page.tsx`

- **Countdown labels**
  - Edit in: `src/components/Countdown.tsx`

- **Easter egg hint & game UI text**
  - Hint: `src/app/page.tsx` (`terminal_id: blaster`).
  - Game text: `src/components/BlasterGame.tsx`.

</details>

