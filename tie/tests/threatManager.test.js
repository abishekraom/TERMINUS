const { processEvent } = require('../src/threatManager');
const webhook = require('../src/webhook');
const gemini = require('../src/gemini');
const firebase = require('../src/firebase');
const uuid = require('uuid');

// Mock external dependencies
jest.mock('../src/webhook');
jest.mock('../src/gemini');
jest.mock('../src/firebase', () => {
    return {
        db: {
            collection: jest.fn(() => ({
                doc: jest.fn(() => ({
                    collection: jest.fn(() => ({
                        doc: jest.fn(() => ({
                            get: jest.fn().mockResolvedValue({ exists: false }),
                            set: jest.fn().mockResolvedValue(true)
                        }))
                    })),
                    set: jest.fn().mockResolvedValue(true)
                })),
                where: jest.fn(() => ({
                  where: jest.fn(() => ({
                    get: jest.fn().mockResolvedValue({ docs: [], size: 0 })
                  }))
                }))
            })),
            batch: jest.fn(() => ({
              update: jest.fn(),
              commit: jest.fn()
            }))
        }
    };
});

describe('Threat Manager processEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('drops event if Gemini marks it irrelevant', async () => {
    gemini.classifyEvent.mockResolvedValue({
      parsed: { isRelevant: false, confidence: 0.99 },
      raw: '{"isRelevant":false}',
      latency: 100
    });

    await processEvent({
      provider: 'TEST',
      dedupKey: 'test-123',
      title: 'Taylor Swift updates tour',
      content: 'Pop star Taylor Swift updates her tour locations.'
    });

    expect(gemini.classifyEvent).toHaveBeenCalledTimes(1);
    expect(webhook.notifyVdie).not.toHaveBeenCalled();
    expect(firebase.db.collection('threats').doc().set).not.toHaveBeenCalled();
  });

  it('drafts low confidence threats to draft collection', async () => {
    gemini.classifyEvent.mockResolvedValue({
      parsed: {
        isRelevant: true,
        confidence: 0.3,
        threatType: 'UNKNOWN',
        severity: 2
      },
      raw: '{"isRelevant":true}',
      latency: 120
    });

    await processEvent({
      provider: 'TEST',
      dedupKey: 'test-456',
      title: 'Vague mention of port delay',
      content: 'Something vaguely slowed down at a port.'
    });

    expect(gemini.classifyEvent).toHaveBeenCalledTimes(1);
    expect(webhook.notifyVdie).not.toHaveBeenCalled(); // No webhook for < 0.4 confidence
    
    // Checked the correct firestore collection was hit
    expect(firebase.db.collection).toHaveBeenCalledWith('threatsDraft');
  });

  it('publishes and notifies VDIE on high confidence threat', async () => {
    gemini.classifyEvent.mockResolvedValue({
      parsed: {
        isRelevant: true,
        confidence: 0.85,
        threatType: 'PORT_CONGESTION',
        severity: 4,
        affectedModes: ['maritime'],
        geoBoundary: {
          type: 'POINT_RADIUS',
          centerLat: 1.29,
          centerLon: 103.85,
          radiusKm: 25,
          namedRegion: 'Singapore'
        }
      },
      raw: '{"isRelevant":true}',
      latency: 300
    });

    await processEvent({
      provider: 'TEST',
      dedupKey: 'test-789',
      title: 'Major strike closes Port of Singapore',
      content: 'Workers are striking, shipping halted entirely.',
      additionalContext: {}
    });

    expect(gemini.classifyEvent).toHaveBeenCalledTimes(1);
    expect(firebase.db.collection).toHaveBeenCalledWith('threats');
    expect(webhook.notifyVdie).toHaveBeenCalledTimes(1);
    expect(webhook.notifyVdie).toHaveBeenCalledWith(
      expect.objectContaining({
        threatId: expect.any(String),
        status: 'ACTIVE'
      }),
      'THREAT_CREATED'
    );
  });
});
