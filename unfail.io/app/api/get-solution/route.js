// File: app/api/get-solution/route.js

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google AI client with your API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function POST(req) {
  try {
    // 1. Get user input from the request body
    const { userInput } = await req.json();

    if (!userInput) {
      return NextResponse.json({ error: 'User input is required' }, { status: 400 });
    }

    // 2. Craft the new, more sarcastic prompt for the Gemini API
    const prompt = `
      You are a brutally honest and sarcastic life coach for a web app named "unfail.io". You've seen it all and you're not impressed. Your goal is to give advice that is genuinely useful but wrapped in a layer of dry, dark humor. You motivate by demotivating.
      The user's situation is: "${userInput}"

      Please provide your complete response in a single, valid JSON object. The object MUST contain the following keys: "solution", "keyword", "youtubeKeyword", "motivationalQuote", "relatedPersonality", "failureTitle", and "uselessLifeHack".

      - "solution": (string) Start by lightly roasting the user's situation, then provide a genuinely constructive and actionable alternative path. The useful advice should be clear despite the sarcastic tone.
      - "keyword": (string) A 2-3 word search phrase suitable for finding relevant news articles about the industry or topic in the solution (e.g., "software development trends", "small business marketing", "healthcare careers").
      - "youtubeKeyword": (string) A practical, tutorial-focused search query for YouTube based on the solution. It should be phrased like a 'how-to' search (e.g., "getting started with software testing", "learn digital marketing basics").
      - "motivationalQuote": (string) A sarcastically motivational or darkly humorous quote that fits the user's situation. It should sound like something you'd say to snap someone out of a pity party.
      - "relatedPersonality": (JSON object) An object with "name" and "story".
          - "name": (string) The name of a real, famous person who faced a similar type of struggle.
          - "story": (string) A brief, inspiring story of how they overcame failure, but frame it with a sarcastic or brutally realistic observation about their struggle.
      - "failureTitle": (string) A funny, overly-dramatic, and official-sounding title for the user's failure.
      - "uselessLifeHack": (string) A single, sarcastic, and amusingly useless life hack that is thematically related to the user's problem.

      Example for a user who failed as an engineer:
      {
        "solution": "Ah, so you've discovered your talent for 'unscheduled structural disassembly.' A rare gift. Look, since building things isn't your forte, how about a career in breaking them on purpose? Quality assurance and software testing are fields where your knack for finding out exactly how things can go wrong is actually a marketable skill.",
        "keyword": "software testing industry",
        "youtubeKeyword": "how to get a job in quality assurance",
        "motivationalQuote": "Congratulations, you've found one of the thousands of ways that won't work. Only a few million more to go.",
        "relatedPersonality": {
          "name": "Colonel Sanders",
          "story": "Colonel Sanders was rejected over 1,000 times before a restaurant agreed to use his chicken recipe. This proves that if you're stubborn enough, you can eventually convince someone to buy your fried food. He was also 65, so you've probably got time."
        },
        "failureTitle": "Certified Master of Rapid Unscheduled Deconstruction",
        "uselessLifeHack": "Save time on laundry by wearing your clothes in the shower. It's not clean, but it's efficient."
      }
    `;

    // 3. Call the Gemini API
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 4. Parse the structured JSON response from Gemini
    let geminiData;
    try {
      const cleanedText = responseText.replace(/^```json\n|```$/g, '').trim();
      geminiData = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse Gemini JSON response:", responseText);
      throw new Error("The AI failed to provide a structured response. Please try again.");
    }

    const { keyword, youtubeKeyword } = geminiData;
    let articles = [];
    let youtubeVideos = [];

    // Use the 'keyword' for news and 'youtubeKeyword' for videos
    if (keyword) {
      // 5. Call the News API with the general keyword
      try {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 28);
        const formattedDate = fromDate.toISOString().split('T')[0];
        const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&from=${formattedDate}&sortBy=publishedAt&language=en&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`;
        const newsResponse = await fetch(newsApiUrl);
        if (newsResponse.ok) {
          const newsData = await newsResponse.json();
          articles = newsData.articles || [];
        }
      } catch (newsError) {
        console.error("News API fetch failed:", newsError);
        articles = [];
      }
    }

    if (youtubeKeyword) {
        // 6. Call the YouTube API with the specific tutorial keyword
        try {
            const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(youtubeKeyword)}&type=video&maxResults=3&relevanceLanguage=en&key=${process.env.YOUTUBE_API_KEY}`;
            const youtubeResponse = await fetch(youtubeApiUrl);
            const youtubeData = await youtubeResponse.json();

            // --- ADDED FOR DEBUGGING ---
            // This will print the full YouTube API response to your terminal console
            console.log("--- YouTube API Response ---");
            console.log(JSON.stringify(youtubeData, null, 2));
            console.log("--------------------------");
            
            // Check if 'items' exists and has content before mapping
            if (youtubeData && youtubeData.items && youtubeData.items.length > 0) {
              youtubeVideos = youtubeData.items.map(item => ({
                  id: item.id.videoId,
                  title: item.snippet.title,
                  thumbnail: item.snippet.thumbnails.default.url,
              }));
            }
        } catch (youtubeError) {
            console.error("YouTube API fetch failed:", youtubeError);
            youtubeVideos = [];
        }
    }


    // 7. Combine all data and send the final response
    const finalResponse = { ...geminiData, articles, youtubeVideos };
    return NextResponse.json(finalResponse);

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
