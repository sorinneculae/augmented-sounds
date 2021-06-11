export default class Grid {

  cells = [];
  gridNotes = {};
  clickCallback;

  constructor(container, scale, clickCallback) {
    this.container = container;
    this.scale = scale;
    // this.clickCallback = clickCallback;
  }
  draw() {
    const gridElem = document.getElementById('grid');
    for (let y = 0; y < 11; y++) { //c
      const octave = document.createElement('div');
      octave.classList.add('octave');
      gridElem.appendChild(octave);
  
      for (let x = 0; x < this.scale.length; x++) {
        const cellDiv = document.createElement('div');
        const currentNote = this.scale[x];
        cellDiv.id = `${currentNote}-${y}`;
        cellDiv.setAttribute('x', x);
        cellDiv.setAttribute('y', y);
        cellDiv.setAttribute('note', currentNote);
  
        cellDiv.addEventListener('click', () => {
          cellDiv.classList.toggle('active');
          // this.clickCallback(cellDiv);
        });
  
        cellDiv.classList.add('grid-cell');
        octave.appendChild(cellDiv);
        
        this.cells.push(cellDiv);
        this.gridNotes[cellDiv.id] = { currentNote };
      }
    }
  }
}