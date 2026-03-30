const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
const config = require('./config');
const logger = require('./logger');

const genAI = new GoogleGenerativeAI(config.gemini.apiKey || 'placeholder');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const systemPrompt = `
You are a maritime and air freight supply chain risk analyst.
Analyze the provided intelligence item and return ONLY valid JSON matching this exact schema.
Never return markdown, never add explanatory text outside JSON.

SCHEMA:
{
  "isRelevant": boolean,
  "threatType": "WEATHER" | "PORT_CONGESTION" | "GEOPOLITICAL_CONFLICT" | "AIRSPACE_CLOSURE" | "SEISMIC" | "SANCTIONS" | "INFRASTRUCTURE" | "PIRACY" | "LABOR_STRIKE" | "CYBER" | "PANDEMIC" | "UNKNOWN",
  "subType": string,
  "confidence": number,
  "severity": number,
  "affectedModes": array of ("maritime" | "air" | "both"),
  "geoBoundary": {
    "type": "POINT_RADIUS" | "BOUNDING_BOX" | "NAMED_REGION",
    "centerLat": number | null,
    "centerLon": number | null,
    "radiusKm": number | null,
    "bbox": [[number, number], [number, number]] | null,
    "namedRegion": string | null
  },
  "affectedInfrastructure": {
    "ports": [{"name": string, "unlocode": string}],
    "airports": [{"name": string, "icao": string}],
    "waterways": [string],
    "countries": [string]
  },
  "temporal": {
    "estimatedStartUtc": string | null,
    "estimatedEndUtc": string | null,
    "estimatedDurationHours": number | null,
    "isOngoing": boolean
  },
  "routingImpact": {
    "edgeCostMultiplier": number,
    "isHardBlock": boolean,
    "minimumSafeDistanceKm": number,
    "suggestedDetourRegion": string | null
  },
  "operatorActions": [string],
  "summary": string,
  "rawConfidenceReasoning": string
}
`;

async function classifyEvent(eventData) {
  const start = Date.now();
  const { sourceType, title, content, additionalContext } = eventData;
  
  const userPrompt = `
SOURCE_TYPE: ${sourceType}
TITLE: ${title}
CONTENT: ${(content || '').slice(0, 4000)}
ADDITIONAL_CONTEXT: ${JSON.stringify(additionalContext || {})}
  `;

  try {
    const result = await model.generateContent({
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      }
    });

    const text = result.response.text();
    const parsed = JSON.parse(text);
    
    const latency = Date.now() - start;
    logger.info({
      event: 'GEMINI_CLASSIFICATION',
      source: sourceType,
      inputTitle: title,
      outputThreatType: parsed.threatType,
      outputSeverity: parsed.severity,
      outputConfidence: parsed.confidence,
      isRelevant: parsed.isRelevant,
      classificationLatencyMs: latency,
      geminiModel: 'gemini-2.0-flash',
    });

    return { parsed, raw: text, latency };
  } catch (error) {
    logger.error({ err: error, source: sourceType, title }, 'Gemini classification failed');
    return null;
  }
}

module.exports = { classifyEvent };
