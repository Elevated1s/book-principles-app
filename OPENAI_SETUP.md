# OpenAI API Setup Guide

## 🤖 **Real AI Integration Setup**

Your app now supports real AI processing using OpenAI's GPT models! Here's how to set it up:

## **Step 1: Get an OpenAI API Key**

1. **Go to OpenAI Platform**: https://platform.openai.com/
2. **Sign up or log in** to your OpenAI account
3. **Navigate to API Keys**: https://platform.openai.com/api-keys
4. **Create a new API key**
5. **Copy the API key** (it starts with `sk-`)

## **Step 2: Configure Environment Variables**

1. **Create a `.env` file** in your project root (same folder as `package.json`)
2. **Add your API key** to the file:

```env
REACT_APP_OPENAI_API_KEY=sk-your_actual_api_key_here
```

3. **Save the file**

## **Step 3: Restart Your Development Server**

After adding the environment variable:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm start
```

## **Step 4: Verify Configuration**

1. **Go to your app**: `http://localhost:3000`
2. **Sign in** to your account
3. **Go to "Upload Book"**
4. **Check the AI Status indicator** - it should show:
   - ✅ **Green**: "OpenAI API key is configured"
   - ⚠️ **Yellow**: "OpenAI API key not found" (if not configured)

## **How It Works**

### **With OpenAI API Key Configured:**
- ✅ **Real AI Analysis**: Books are analyzed using GPT-3.5-turbo
- ✅ **Actual Content**: Summaries, principles, and daily content are AI-generated
- ✅ **File Processing**: Text files are processed for content analysis
- ✅ **Smart Fallbacks**: If AI fails, falls back to quality simulated content

### **Without OpenAI API Key:**
- ⚠️ **Fallback Mode**: Uses high-quality simulated content
- ⚠️ **No File Processing**: File content is not analyzed
- ⚠️ **Generic Content**: Content is based on book title/author only

## **Cost Information**

- **GPT-3.5-turbo**: ~$0.002 per 1K tokens
- **Typical book analysis**: ~$0.01-0.05 per book
- **Free tier**: $5 credit for new users
- **Pay-as-you-go**: No monthly fees

## **Security Notes**

⚠️ **Important**: The API key is currently stored in the frontend for development. For production:

1. **Move to backend**: Create a server to handle API calls
2. **Environment variables**: Use server-side environment variables
3. **Rate limiting**: Implement usage limits
4. **User quotas**: Track and limit per-user usage

## **Troubleshooting**

### **"OpenAI API key not found"**
- Check that `.env` file exists in project root
- Verify the variable name is exactly `REACT_APP_OPENAI_API_KEY`
- Restart the development server after adding the key

### **"API key invalid"**
- Verify your API key is correct
- Check your OpenAI account has credits
- Ensure the key has the necessary permissions

### **"Rate limit exceeded"**
- Wait a few minutes before trying again
- Consider upgrading your OpenAI plan
- Implement rate limiting in your app

## **Next Steps**

Once OpenAI is configured, you can:

1. **Upload text files** for real content analysis
2. **Get AI-generated summaries** based on actual book content
3. **Receive personalized daily content** from the AI
4. **Process multiple books** with unique insights

## **Support**

If you need help:
1. Check the OpenAI documentation: https://platform.openai.com/docs
2. Review your API usage: https://platform.openai.com/usage
3. Contact OpenAI support for API issues 