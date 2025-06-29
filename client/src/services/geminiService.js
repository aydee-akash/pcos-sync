const API_KEY = 'AIzaSyBltfO0pCni99NkY3rD1HkhK5xJZubTkvY';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Helper function to format markdown text
const formatMarkdown = (text) => {
  // Replace markdown headers with HTML
  text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  
  // Replace bold and italic
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Replace lists
  text = text.replace(/^\s*\d+\.\s+(.*$)/gm, '<li>$1</li>');
  text = text.replace(/^\s*[-*]\s+(.*$)/gm, '<li>$1</li>');
  
  // Replace line breaks
  text = text.replace(/\n/g, '<br>');
  
  return text;
};

export const generatePhenotypeExplanation = async (similarity, sequences) => {
  try {
    const prompt = `You are a medical professional explaining genetic test results to a patient. 
    Given these results:
    - Similarity Score: ${similarity * 100}%
    - Sequence 1: ${sequences[0]}
    - Sequence 2: ${sequences[1]}
    
    Please provide a brief explanation (2-3 sentences) in second person formal speech about what this genetic similarity means for your PCOS phenotype. 
    Focus on the key implications for your health.`;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.error?.message || response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    return formatMarkdown(rawText);
  } catch (error) {
    console.error('Error generating explanation:', error);
    return "Unable to generate AI explanation at this time.";
  }
};

export const generateRecommendations = async (similarity, explanation) => {
  try {
    const prompt = `Based on this PCOS phenotype analysis:
    - Similarity Score: ${similarity * 100}%
    - Analysis: ${explanation}
    
    Please provide 3-4 specific recommendations for your care, using second person formal speech.
    Format as a numbered list, keeping each recommendation brief and actionable.`;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.error?.message || response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    const formattedText = formatMarkdown(rawText);
    
    // Return the formatted HTML as a single string
    return formattedText;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return `<ol>
      <li>Schedule a consultation with a genetic counselor</li>
      <li>Consider additional genetic testing</li>
      <li>Monitor for related symptoms and conditions</li>
      <li>Maintain regular follow-ups with your healthcare provider</li>
    </ol>`;
  }
}; 