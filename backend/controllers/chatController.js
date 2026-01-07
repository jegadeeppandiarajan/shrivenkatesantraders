const Groq = require("groq-sdk");

// Initialize Groq AI (Llama 3 - Free tier: 14,400 requests/day)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Shop context for better AI responses
const shopContext = `
You are a helpful AI assistant for Shri Venkatesan Traders, a premium industrial supplies company in India.

About the company:
- 25+ years of experience in industrial supplies
- ISO 9001:2015 certified
- 10,000+ satisfied customers
- Pan-India delivery within 24 hours

Products we sell:
- Pipes: PVC, MS, GI, and stainless steel pipes in various sizes
- Motors: Electric motors, submersible pumps, automation motors
- Valves: Ball valves, butterfly valves, check valves, gate valves
- Fittings: Various pipe fittings and connectors
- Pumps: Industrial and agricultural pumps
- Accessories: All related industrial accessories

Services:
- Free shipping on orders above ₹5000
- 24/7 customer support
- Bulk order discounts for B2B
- Warranty support on all products
- Technical consultation available

Payment options: Credit/Debit cards, UPI, Bank transfer, COD

Always be helpful, professional, and guide customers to relevant products or services.
Keep responses concise (2-3 sentences max unless detailed info is requested).
If asked about specific prices, suggest contacting the sales team or browsing the products page.
`;

// Chat with Gemini AI
exports.chatWithAI = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error: "AI service not configured",
        fallbackResponse: getFallbackResponse(message),
      });
    }

    // Build messages array with context
    const messages = [
      {
        role: "system",
        content: shopContext,
      },
      // Add conversation history
      ...conversationHistory.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
      // Add current message
      {
        role: "user",
        content: message,
      },
    ];

    // Call Groq API with Llama 3
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile", // Fast & free Llama 3 model
      temperature: 0.7,
      max_tokens: 200,
    });

    const aiText =
      chatCompletion.choices[0]?.message?.content ||
      getFallbackResponse(message);

    res.json({
      response: aiText,
      success: true,
    });
  } catch (error) {
    console.error("Groq AI Error:", error);

    // Return fallback response if AI fails
    res.status(200).json({
      response: getFallbackResponse(req.body.message),
      success: true,
      fallback: true,
    });
  }
};

// Fallback responses when AI is unavailable
function getFallbackResponse(userInput) {
  const input = userInput.toLowerCase();

  const responses = {
    pipe: "We offer premium pipes including PVC, MS, GI, and stainless steel in various sizes. Browse our products page or contact us for specific requirements!",
    motor:
      "Our motors collection includes electric motors, submersible pumps, and automation motors from leading brands with warranty support.",
    valve:
      "We supply ball valves, butterfly valves, check valves, and gate valves for various fluid control applications. All ISO certified!",
    deliver:
      "We dispatch within 24 hours across pan-India. Free shipping on orders above ₹5000 with real-time tracking.",
    ship: "We dispatch within 24 hours across pan-India. Free shipping on orders above ₹5000 with real-time tracking.",
    price:
      "We offer competitive wholesale and retail pricing. Bulk orders get special discounts. Contact our sales team for custom quotes!",
    cost: "We offer competitive wholesale and retail pricing. Bulk orders get special discounts. Contact our sales team for custom quotes!",
    warrant:
      "All products come with manufacturer warranty. We provide hassle-free warranty claims and replacement support.",
    support:
      "We're available 24/7 via phone, email, and chat. Our technical team can assist with product selection and installation.",
    help: "We're available 24/7 via phone, email, and chat. Our technical team can assist with product selection and installation.",
    payment:
      "We accept credit/debit cards, UPI, bank transfer, and COD for eligible locations.",
    pay: "We accept credit/debit cards, UPI, bank transfer, and COD for eligible locations.",
    bulk: "Looking for bulk orders? We offer special B2B discounts. Our corporate sales team will be happy to assist!",
    wholesale:
      "Looking for bulk orders? We offer special B2B discounts. Our corporate sales team will be happy to assist!",
  };

  for (const [keyword, response] of Object.entries(responses)) {
    if (input.includes(keyword)) return response;
  }

  const defaultResponses = [
    "Welcome to Shri Venkatesan Traders! We specialize in premium industrial supplies - pipes, motors, valves, and more. How can I help you today?",
    "Thanks for reaching out! With 25+ years of experience, we ensure quality products and fast delivery. What are you looking for?",
    "Great question! Our expert team is here to assist. We offer ISO certified products with 24/7 support across India.",
    "We're happy to help! Browse our products or ask about pricing, delivery, or technical specifications.",
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}
