// aiService.js - AI Processing Service
import { updateBookWithAIResults, updateBookStatus } from './bookService';
import { analyzeBookWithAI, extractTextFromFile, isOpenAIConfigured, getAPIKeyStatus } from './openaiService';

// Main AI processing function
export const processBookWithAI = async (bookId, bookData, file = null) => {
  try {
    console.log('Starting AI processing for book:', bookId);
    
    // Update status to processing
    await updateBookStatus(bookId, 'processing');

    // Check if OpenAI is configured
    const apiStatus = getAPIKeyStatus();
    console.log('OpenAI API Status:', apiStatus);

    let fileContent = null;
    
    // Extract text from file if provided
    if (file) {
      try {
        fileContent = await extractTextFromFile(file);
        console.log('File content extracted, length:', fileContent?.length || 0);
      } catch (error) {
        console.error('Error extracting file content:', error);
        // Continue without file content
      }
    }

    // Generate AI content using OpenAI or fallback
    const aiResults = await analyzeBookWithAI(bookData, fileContent);

    // Update book with AI results
    await updateBookWithAIResults(bookId, aiResults);

    console.log('AI processing completed successfully');
    return aiResults;
  } catch (error) {
    console.error('Error processing book with AI:', error);
    await updateBookStatus(bookId, 'failed');
    throw error;
  }
};

// Function to check OpenAI configuration status
export const checkOpenAIConfiguration = () => {
  return getAPIKeyStatus();
};

// Function to get processing status
export const getProcessingStatus = () => {
  return {
    openaiConfigured: isOpenAIConfigured(),
    message: isOpenAIConfigured() 
      ? 'OpenAI API is configured and ready to use' 
      : 'OpenAI API key not configured - using fallback content'
  };
}; 