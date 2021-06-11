//c
import Util from "./Util.js";

import HandDetection from "./hands/HandDetection.js";
import RightHand from "./hands/RightHand.js";
import LeftHand from "./hands/LeftHand.js";
import Grid from "./Grid.js";
import Gestures from "./gestures/Gestures.js";
import config from "./config/config.js";

export default class App {

  grid = null;

  leftHand = null;
  rightHand = null;
  music = null;
  gestures = null;
  
  videoDiv = null;
  gridDiv = null;

  canvasVideo = null;
  ctxVideo = null;
  canvasGrid = null;
  ctxGrid = null;
  canvasGesture = null;
  ctxGesture = null;

  canvasWidth = 0;
  canvasHeight = 0;
  originX = 0;
  originY = 0;

  constructor() {
    this.init();
  }

  async init() {
    this.initializeHTMLElements();
    await this.initializeVideo();
    this.initializeCanvas();
    this.initializeHandDetection();
    this.initializeGrid();
    this.initializeHands();
    this.initializeGestures();
  }

  initializeHTMLElements() {
    this.videoDiv = document.getElementById('video');
    this.gridDiv = document.getElementById('grid');
    this.canvasVideo = document.getElementById('canvasVideo');
    this.ctxVideo = canvasVideo.getContext('2d');
    this.canvasGrid = document.getElementById('canvasGrid');
    this.ctxGrid = canvasGrid.getContext('2d');
    this.canvasGesture = document.getElementById('canvasGesture');
    this.ctxGesture = canvasGesture.getContext('2d');
  }

  async initializeVideo() {
    navigator.getUserMedia({
        audio: false,
        video: {
          width: config.videoWidth, //c
          height: config.videoHeight //c
        }
      },
      stream => this.videoDiv.srcObject = stream,
      err => console.error(err)
    );
    return this.videoDiv.play();
  }

  initializeCanvas() {
    this.canvasWidth = this.videoDiv.offsetWidth;
    this.canvasHeight = this.videoDiv.offsetHeight;
    this.canvasVideo.width = this.canvasWidth;
    this.canvasVideo.height = this.canvasHeight;
    this.originX = this.canvasVideo.getBoundingClientRect().x;
    this.originY = this.canvasVideo.getBoundingClientRect().y;
  }

  initializeGrid() {
    this.canvasGrid.width = this.canvasWidth;
    this.canvasGrid.height = this.canvasHeight;
    this.gridDiv.style.width = `${this.canvasWidth}px`;
    this.gridDiv.style.height = `${this.canvasHeight}px`;
    this.grid = new Grid(this.gridDiv, ['B#', 'D', 'F', 'G', 'A']);
    // this.music.scale, this.music.startPlayer.bind(this.music));
    this.grid.draw();
  }

  initializeHandDetection() {
    this.handDetection = new HandDetection();
    this.handDetection.detect(this.videoDiv);
    this.handDetection.holistic.onResults(this.drawHands.bind(this));
  }

  initializeHands() {
    this.canvasGesture.width = this.canvasWidth;
    this.canvasGesture.height = this.canvasHeight;
    this.leftHand = new LeftHand(this.ctxGesture, this.canvasWidth, this.canvasHeight);
    this.rightHand = new RightHand(this.ctxGrid, this.canvasWidth, this.canvasHeight);
  }

  initializeGestures() {
    this.gestures = new Gestures(this.canvasWidth, this.canvasHeight);
  }

  /**
   * Draw hand points
   * @param {Array} results
   * @returns {number}
   */

  drawHands(results) {
    this.ctxVideo.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctxGrid.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctxGesture.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  
    this.ctxVideo.drawImage(results.image, 0, 0, this.canvasWidth, this.canvasHeight);
    const rightHandPoints = results?.rightHandLandmarks || [];
    const leftHandPoints = results?.leftHandLandmarks || [];
    
    if (rightHandPoints.length) {
      this.rightHand.draw(rightHandPoints);
      this.checkRightHandTouch();
    }

    if (leftHandPoints.length) {
      this.leftHand.draw(leftHandPoints);
      this.gestures.getGesture('bpm', [leftHandPoints[4], leftHandPoints[8]]);
      this.gestures.getGesture('newGesture', leftHandPoints);
    }
  }

  checkRightHandTouch() {
    const touchedElements = Util.checkGridTouch(
      this.grid.cells,
      this.grid.gridNotes,
      this.rightHand.activePoints,
      { 
        x: this.originX,
        y: this.originY
      }
    );
    // touchedElements.forEach(element => this.music.startPlayer(element));
  }
}