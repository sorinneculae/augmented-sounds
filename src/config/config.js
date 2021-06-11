const config = {
  videoWidth: { min: 780, ideal: 780, max: 1024 },
  videoHeight: { min: 440, max: 768 },
  handDetection: {
    url: 'https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.1/',
    options: {
      selfieMode: true,
      upperBodyOnly: true,
      smoothLandmarks: true,
      minDetectionConfidence: 0.8,
      minTrackingConfidence: 0.5
    }
  }
}

export default config;