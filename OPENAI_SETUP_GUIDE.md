# 🚀 Quick OpenAI API Setup Guide

## Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the API key (it starts with `sk-`)

## Step 2: Configure in the App

1. **Start your app**: `npm start`
2. **Sign in** to your account
3. **Click "AI Settings"** in the navigation
4. **Paste your API key** in the input field
5. **Click "Save API Key"**
6. **Test the connection** to verify it works

## Step 3: Alternative Method (Environment Variable)

If you prefer to use environment variables:

1. Create a `.env` file in your project root
2. Add: `REACT_APP_OPENAI_API_KEY=sk-your_actual_api_key_here`
3. Restart your development server

## What You Get

✅ **Real AI Analysis**: Books are analyzed using GPT-4o-mini (latest model)  
✅ **File Processing**: Upload text files for content analysis  
✅ **Smart Summaries**: AI-generated book summaries and insights  
✅ **Daily Content**: Personalized daily content from your books  
✅ **Fallback Mode**: Works even without API key (simulated content)  
✅ **Enhanced Error Handling**: Clear, actionable error messages  
✅ **Real-time Status**: Live AI configuration status with helpful guidance  

## Cost Information

- **GPT-4o-mini**: ~$0.00015 per 1K tokens (very cost-effective!)
- **Typical book analysis**: ~$0.001-0.005 per book (much cheaper than before)
- **Free tier**: $5 credit for new users
- **Pay-as-you-go**: No monthly fees

## Troubleshooting

**"API key not configured"**
- Make sure you saved the key in the app
- Check that the key starts with `sk-`
- Try the test connection button
- Check the detailed status message for guidance

**"Connection failed"**
- Verify your API key is correct
- Check your OpenAI account has credits
- Ensure the key has the necessary permissions
- Look for specific error messages in the status

## Security Note

The API key is stored in your browser's localStorage for development. For production use, consider moving API calls to a backend server.

---

**Ready to start?** Open your app and click "AI Settings" to configure your OpenAI API key, or check the upload page for real-time AI status! 