<img width="3188" height="1202" alt="frame (3)" src="https://github.com/user-attachments/assets/517ad8e9-ad22-457d-9538-a9e62d137cd7" />


# Unfail.io 🎯


## Basic Details
### Team Name: Sooraj V


### Team Members
- Team Lead: Sooraj V - College of Engineering Trivandrum

### Project Description
Unfail.io is a sarcastically motivating life assistant that “unfails” your failures with hilarious prompts, motivational advice, and a dash of humor. Tell it what is wrong in your life, even something as simple as 'I took engineering and now I am jobless' and see it put out interesting results. Malayalathil paranjal, oru tholvi il ninnum oru vijayam aayi maaran ulla oru vazhi paranju tharum pakshe ath paranju tharunna reethi ishtam aavanam enn illa.

### The Problem (that doesn't exist)
Nobody asked for another motivational app that sugarcoats failure. I am here to solve the “problem” of being *too* serious about setbacks with sarcastic quotes, unhelpful tips, and uselessly useful advice.

### The Solution (that nobody asked for)
This webapp delivers a complete roadmap of how you can make your life a little less failure by offering advices, news articles, video guides, etc, all of which are delivered in a sarcastic and funny tone. Although the UI appears friendly, the results are not, and reading the solutions will give you useful advice but will make you feel more like a failure due to the nature of results.
<br>

## Technical Details
### Technologies/Components Used
For Software:
- HTML, CSS, Javascript
- Next.js, React, Tailwind, Node.js
- Lucide-react icons for UI
- Gemini API
- newsapi.org API
- Youtube API

### Implementation
For Software:

The project is built using **Next.js** with React for the frontend, providing a fast, server-side rendered experience. Tailwind CSS powers the stylish and responsive UI, making the sarcastic vibe visually appealing and easy to navigate.

- The splash screen is shown initially with a fade-out animation before revealing the main interface.
- Once the splash fades, a random sarcastic quote is displayed alongside an input field where users can describe what went wrong.
- On submission, the input is sent to a backend API route (`/api/get-solution`), which processes the request (mock or real logic) and returns a funny and sarcastic motivational quote, suggested solutions, related news articles, YouTube video guides, and personality stories, all meant to motivate and demotivate the user simultaneously.
- The frontend then animates the display of the response with sections styled using a custom sketchy border effect.
- Additional UI features include smooth transitions, loading states, and error handling to maintain a polished user experience.
- Iconography is handled by the Lucide-react library to complement the sarcastic, playful tone.
# Installation
1. Clone the repository: `git clone https://github.com/your-username/unfail.io.git`
2. Navigate to the project folder:  `cd unfail.io`
3. Install dependencies: `npm install`
4. Create a .env.local file in the root folder and add your API keys or configs according to .env.example file


# Run
`npm run dev`

### Project Documentation
For Software: [Watch the video](/public/main_recording.mp4)

# Screenshots (Add at least 3)
![Screenshot1](/public/screenshot1.png) <br>
*This is the main home page.*

![Screenshot2](/public/screenshot2.png) <br>
*This image shows some part of the result obtained along with the prompt used to achieve it.*

![Screenshot3](/public/screenshot3.png) <br>
*This image shows the next part of the result.*

## Team Contributions
- Sooraj V: Worked on the full-stack app.

---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--25-25?link=https%3A%2F%2Fwww.tinkerhub.org%2Fevents%2FQ2Q1TQKX6Q%2FUseless%2520Projects)



