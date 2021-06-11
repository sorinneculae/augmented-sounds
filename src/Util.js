export default class Util {

  static checkGridTouch(grid, gridNotes, points, origins)  {
    const pointsCopy = { ...points };
    const touchedElements = [];
    grid.forEach(elem => {
      const { id } = elem;
      const bBox = elem.getBoundingClientRect();
      let touched = false;
      Object.values(pointsCopy).forEach(p => {
        if (p.x > bBox.x - origins.x && p.x < bBox.x - origins.x + bBox.width &&
          p.y > bBox.y - origins.y && p.y < bBox.y - origins.y + bBox.height) {
          touched = true;
        }
      })
  
      if (touched) {
        if (!gridNotes[id].active) {
          gridNotes[id].active = true;
          elem.classList.toggle('active');
          touchedElements.push(elem);
        }
      } else {
        gridNotes[id].active = false;
      }
    });
    return touchedElements;
  }
}