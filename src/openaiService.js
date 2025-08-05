// openaiService.js - OpenAI API Integration Service

// OpenAI API Configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-3.5-turbo';

// Get API key from environment variable
const getAPIKey = () => {
  return process.env.REACT_APP_OPENAI_API_KEY || localStorage.getItem('openai_api_key');
};

// Check if OpenAI is configured
export const isOpenAIConfigured = () => {
  const apiKey = getAPIKey();
  return apiKey && apiKey !== 'your_openai_api_key_here' && apiKey.startsWith('sk-');
};

// Get API key status for UI display
export const getAPIKeyStatus = () => {
  const apiKey = getAPIKey();
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    return { configured: false, message: 'API key not configured' };
  }
  if (!apiKey.startsWith('sk-')) {
    return { configured: false, message: 'Invalid API key format' };
  }
  return { configured: true, message: 'API key configured' };
};

// Set API key (for manual configuration)
export const setAPIKey = (apiKey) => {
  if (apiKey && apiKey.startsWith('sk-')) {
    localStorage.setItem('openai_api_key', apiKey);
    return true;
  }
  return false;
};

// Extract text from uploaded file
export const extractTextFromFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        resolve(text);
      } catch (error) {
        reject(new Error('Failed to read file content'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

// Make API call to OpenAI
const callOpenAI = async (messages, maxTokens = 1000) => {
  const apiKey = getAPIKey();
  
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API not configured');
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: messages,
        max_tokens: maxTokens,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw error;
  }
};

// Generate fallback content when OpenAI is not available
const generateFallbackContent = (bookData) => {
  const { title, author } = bookData;
  
  return {
    summary: `"${title}" by ${author} is a compelling book that explores important themes and concepts. This book offers valuable insights and practical wisdom that can be applied to daily life.`,
    keyPrinciples: [
      "Focus on continuous improvement and personal growth",
      "Develop strong habits and consistent routines", 
      "Build meaningful relationships and connections",
      "Embrace challenges as opportunities for learning",
      "Maintain a positive mindset and resilience"
    ],
    dailyContent: [
      {
        day: 1,
        title: "Start Your Journey",
        content: `Today, begin your journey with "${title}". Take a moment to reflect on what you hope to learn and how you can apply the wisdom from this book to your daily life.`
      },
      {
        day: 2,
        title: "Building Awareness",
        content: "Practice mindfulness and self-awareness today. Notice your thoughts, emotions, and behaviors without judgment."
      },
      {
        day: 3,
        title: "Taking Action",
        content: "Identify one small action you can take today that aligns with the principles from the book. Start with something simple and build from there."
      },
      {
        day: 4,
        title: "Reflection and Growth",
        content: "Take time to reflect on your progress. What have you learned so far? What challenges have you faced and how have you overcome them?"
      },
      {
        day: 5,
        title: "Sharing Wisdom",
        content: "Share something you've learned with someone else today. Teaching others helps reinforce your own understanding and creates meaningful connections."
      }
    ]
  };
};

// Analyze book with AI
export const analyzeBookWithAI = async (bookData, fileContent = null) => {
  try {
    // Check if OpenAI is configured
    if (!isOpenAIConfigured()) {
      console.log('OpenAI not configured, using fallback content');
      return generateFallbackContent(bookData);
    }

    const { title, author, description } = bookData;
    
    // Prepare context for AI analysis
    let context = `Book: "${title}" by ${author}`;
    if (description) {
      context += `\nDescription: ${description}`;
    }
    if (fileContent) {
      // Limit file content to avoid token limits
      const truncatedContent = fileContent.substring(0, 3000);
      context += `\n\nBook Content (excerpt):\n${truncatedContent}`;
    }

    // Generate summary
    const summaryPrompt = `Based on the following book information, provide a concise but insightful summary (2-3 sentences):

${context}

Summary:`;

    const summary = await callOpenAI([
      { role: 'user', content: summaryPrompt }
    ], 200);

    // Generate key principles
    const principlesPrompt = `Based on the book information above, identify 5 key principles or lessons that readers can apply to their daily lives. Format as a simple list:

Key Principles:`;

    const principlesResponse = await callOpenAI([
      { role: 'user', content: `${context}\n\n${principlesPrompt}` }
    ], 300);

    const keyPrinciples = principlesResponse
      .split('\n')
      .filter(line => line.trim() && (line.includes('.') || line.includes('-') || line.includes('•')))
      .slice(0, 5)
      .map(principle => principle.replace(/^\d+\.\s*|^[-•]\s*/, '').trim());

    // Generate daily content
    const dailyPrompt = `Based on the book information above, create 5 days of daily content that readers can use for personal development. Each day should have a lesson, exercise, affirmation, and thought. Format as JSON:

{
  "dailyContent": [
    {
      "day": 1,
      "lesson": "Today's lesson from the book",
      "exercise": "Practical exercise to apply the lesson",
      "affirmation": "Positive affirmation related to the lesson",
      "thought": "Reflective thought for the day"
    }
  ]
}`;

    const dailyResponse = await callOpenAI([
      { role: 'user', content: `${context}\n\n${dailyPrompt}` }
    ], 500);

    let dailyContent;
    try {
      // Try to parse JSON response
      const jsonMatch = dailyResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        dailyContent = JSON.parse(jsonMatch[0]).dailyContent || [];
      } else {
        throw new Error('No JSON found');
      }
    } catch (parseError) {
      // Fallback: generate simple daily content
      dailyContent = [
        {
          day: 1,
          lesson: `Begin your journey with "${title}". Reflect on what you hope to learn and how you can apply the wisdom from this book.`,
          exercise: "Write down three goals you have for reading this book and how you plan to apply its lessons.",
          affirmation: "I am open to learning and growing through the wisdom of this book.",
          thought: "Every great journey begins with a single step. What step will you take today?"
        },
        {
          day: 2,
          lesson: "Building Awareness - Practice mindfulness and self-awareness today.",
          exercise: "Notice your thoughts, emotions, and behaviors without judgment. Keep a brief journal of your observations.",
          affirmation: "I am becoming more aware of my thoughts and actions each day.",
          thought: "Awareness is the first step toward positive change. What patterns do you notice in yourself?"
        },
        {
          day: 3,
          lesson: "Taking Action - Identify one small action you can take today that aligns with the principles from the book.",
          exercise: "Choose one principle from the book and take a concrete action to apply it in your life today.",
          affirmation: "I have the power to take positive actions that align with my values.",
          thought: "Small actions compound over time. What small step can you take today?"
        },
        {
          day: 4,
          lesson: "Reflection and Growth - Take time to reflect on your progress and learning journey.",
          exercise: "Reflect on what you've learned so far. What challenges have you faced? What successes have you experienced?",
          affirmation: "I am growing and learning through reflection and self-awareness.",
          thought: "Growth often comes through challenges. How have you grown through recent difficulties?"
        },
        {
          day: 5,
          lesson: "Sharing Wisdom - Share something you've learned with someone else today.",
          exercise: "Share a key insight or lesson from the book with a friend, family member, or colleague.",
          affirmation: "I have valuable wisdom to share with others, and sharing helps me learn more deeply.",
          thought: "Teaching others is one of the best ways to learn. Who can you share your insights with today?"
        }
      ];
    }

    return {
      summary: summary.trim(),
      keyPrinciples: keyPrinciples.length > 0 ? keyPrinciples : generateFallbackContent(bookData).keyPrinciples,
      dailyContent: dailyContent.length > 0 ? dailyContent : generateFallbackContent(bookData).dailyContent
    };

  } catch (error) {
    console.error('Error analyzing book with AI:', error);
    console.log('Falling back to generated content');
    return generateFallbackContent(bookData);
  }
};

// Test OpenAI connection
export const testOpenAIConnection = async () => {
  try {
    if (!isOpenAIConfigured()) {
      return { success: false, message: 'API key not configured' };
    }

    const response = await callOpenAI([
      { role: 'user', content: 'Hello! Please respond with "OpenAI connection successful" if you can read this.' }
    ], 50);

    return { 
      success: true, 
      message: 'OpenAI connection successful',
      response: response
    };
  } catch (error) {
    return { 
      success: false, 
      message: `Connection failed: ${error.message}` 
    };
  }
};

// Generate additional daily content
export const generateAdditionalDailyContent = async (bookData, currentDays, additionalDays = 10) => {
  try {
    // Check if OpenAI is configured
    if (!isOpenAIConfigured()) {
      console.log('OpenAI not configured, using fallback content');
      return generateFallbackAdditionalContent(bookData, currentDays, additionalDays);
    }

    const { title, author } = bookData;
    
    // Prepare context for AI analysis
    const context = `Book: "${title}" by ${author}
Current days of content: ${currentDays}
Generate ${additionalDays} additional days of daily content.`;

    // Generate additional daily content
    const additionalPrompt = `Based on the book "${title}" by ${author}, create ${additionalDays} additional days of daily content for personal development. Each day should have a lesson, exercise, affirmation, and thought. Format as JSON:

{
  "dailyContent": [
    {
      "day": ${currentDays + 1},
      "lesson": "Day ${currentDays + 1} lesson from the book",
      "exercise": "Day ${currentDays + 1} practical exercise",
      "affirmation": "Day ${currentDays + 1} positive affirmation",
      "thought": "Day ${currentDays + 1} reflective thought"
    },
    {
      "day": ${currentDays + 2},
      "lesson": "Day ${currentDays + 2} lesson from the book",
      "exercise": "Day ${currentDays + 2} practical exercise",
      "affirmation": "Day ${currentDays + 2} positive affirmation",
      "thought": "Day ${currentDays + 2} reflective thought"
    }
  ]
}`;

    const additionalResponse = await callOpenAI([
      { role: 'user', content: `${context}\n\n${additionalPrompt}` }
    ], 800);

    let additionalContent;
    try {
      // Try to parse JSON response
      const jsonMatch = additionalResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        additionalContent = parsed.dailyContent || [];
      } else {
        throw new Error('No JSON found');
      }
    } catch (parseError) {
      // Fallback: generate simple additional content
      additionalContent = generateFallbackAdditionalContent(bookData, currentDays, additionalDays);
    }

    return additionalContent;

  } catch (error) {
    console.error('Error generating additional daily content:', error);
    console.log('Falling back to generated content');
    return generateFallbackAdditionalContent(bookData, currentDays, additionalDays);
  }
};

// Generate fallback additional content
const generateFallbackAdditionalContent = (bookData, currentDays, additionalDays) => {
  const { title } = bookData; // 'author' removed from destructuring to fix ESLint warning
  const dailyContent = [];

  for (let i = 1; i <= additionalDays; i++) {
    const dayNumber = currentDays + i;
    
    dailyContent.push({
      day: dayNumber,
      lesson: `Day ${dayNumber}: Continue your journey with "${title}". Focus on applying the principles you've learned so far.`,
      exercise: `Day ${dayNumber}: Practice one of the key principles from the book for 15 minutes today.`,
      affirmation: `Day ${dayNumber}: I am growing and learning every day through the wisdom of great books.`,
      thought: `Day ${dayNumber}: Reflect on how the lessons from "${title}" are shaping your daily life.`
    });
  }

  return dailyContent;
};
