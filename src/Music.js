export default class Music {

  scale = [];
  notePlayers = [];
  noteOffset = (Tone.Time('1m') / 11) * 6; 
  scheduledNotes = {};
  currentPlayer = 0;
  noteY = 0;

  constructor() {
    Tone.Transport.bpm.value = 90;
    this.setScale();
    this.setPlayers();
    this.initializeLoop();
  }

  setScale() {
    for (let i = 0; i < 2; i++) {
      const notes = ['B#', 'D', 'F', 'G', 'A']; //c
      for (let j = 0; j < notes.length; j++) { //c
        this.scale.push(`${ notes[j] }${ i + 3 }`); //c
      }
    }
  }

  setPlayers() {
    Tone.Offline(() => {
      const synth = this.getSynth();
      for (let i = 0; i < this.scale.length; i++) {
        synth.triggerAttackRelease(this.scale[i], Tone.Time('1m') / 11, i * this.noteOffset);
      };
    }, this.noteOffset * 11).then(buffer => {
      for (let i = 0; i < this.scale.length; i++) {
        Tone.setContext(Tone.context);
        const player = new Tone.Player(buffer).toDestination();
        player.volume.value = -20;
        this.notePlayers.push(player);
      }
    });
  }

  startPlayer(elem) {
    const { id } = elem;
    const x = parseInt(elem.getAttribute('x'));
    const y = parseInt(elem.getAttribute('y'));
    if (elem.classList.contains('note-active')) {
      const scheduleId = Tone.Transport.schedule((time) => {
        this.notePlayers[this.currentPlayer].start(time, x * this.noteOffset, this.noteOffset);
        this.currentPlayer = (this.currentPlayer + 1) % this.notePlayers.length;
        elem.classList.add('animate-key');
        setTimeout(() => elem.classList.remove('animate-key'), 400);
      }, y * (Tone.Time('1m') / 11));
      this.scheduledNotes[id] = scheduleId;
    } else {
      Tone.Transport.clear(this.scheduledNotes[id]);
    }
  }

  initializeLoop() {
    Tone.Transport.loopEnd = '1m';
    Tone.Transport.loop = true;
    this.startLoop();
    setTimeout(() => Tone.start(), 500);
  }
  
  startLoop() {
    Tone.Transport.start();
  }

  pauseLoop() {
    Tone.Transport.pause();
  }

  getSynth(nr) {
    let synth;
    const filter = new Tone.Filter({ frequency: 1100, rolloff: -12 }).toDestination();
    switch (nr) {
      case 1:
        synth = new Tone.Synth().toDestination();
        break;
  
      case 2:
        synth = new Tone.MembraneSynth().toDestination();
        break;
      
      case 3:
        synth = new Tone.MonoSynth({
          oscillator: {
            type: "square"
          },
          envelope: {
            attack: 0.1
          }
        }).toDestination();
        break;
      
      case 4:
        synth = new Tone.Synth({
        oscillator: {
          type: 'sawtooth',
        },
        envelope: {
          attack: 0.005,
          decay: 0.1,
          sustain: 0.3,
          release: 2,
        },
      }).connect(filter);
      break;
  
      default: 
        synth = new Tone.Synth({
          oscillator: {
            type: 'sine',
          },
          envelope: {
            attack: 0.005,
            decay: 0.1,
            sustain: 0.3,
            release: 1,
          },
        }).connect(filter);
    }
    return synth;
  }
}