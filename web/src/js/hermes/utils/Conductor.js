export class Conductor {
  constructor() {
    this.train = [];
    this.id = 0;
  }

  add(item) {
    this.id++;

    this.train.push({
      id: this.id,
      ...item,
    });

    return this.id;
  }

  remove(id) {
    for (let i = this.train.length - 1; i >= 0; i--) {
      if (this.train[i].id === id) {
        return this.train.splice(i, 1);
      }
    }

    return false;
  }
}
