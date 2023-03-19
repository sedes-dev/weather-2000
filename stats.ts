import { NextFunction, Request, Response } from 'express';

class Stats {
  private data!: {
    date: Date,
    routes: {
      name: string,
      order: number,
      counts: number[]
    }[]
  }

  constructor() {
    this.createNewData();
  }

  createNewData() {
    this.data = {
      date: new Date(),
      routes: []
    }
  }

  collect(name: string, includePath: boolean, order: number) {
    return (req: Request, res: Response, next: NextFunction) => {
      this.countVisit(`${name}${includePath ? ' (' + req.path + ')' : ''}`, order);
      next();
    }
  }

  countVisit(name: string, order: number) {
    this.dataHousekeeping();
    let routeData = this.data.routes.find(route => route.name === name);

    if (!routeData) {
      routeData = {
        name: name,
        order: order,
        counts: new Array(24).fill(0)
      };

      this.data.routes.push(routeData);

      this.data.routes = this.data.routes.sort((r1, r2) => {
        if (r1.order < r2.order) return -1;
        if (r1.order > r2.order) return 1;
        return 0;
      })
    }

    const hour = new Date().getHours();
    routeData.counts[hour]++;
  }

  dataHousekeeping() {
    if (this.data.date.toDateString() !== new Date().toDateString()) {
      this.data.date = new Date();
      this.data.routes = [];
    }
  }

  getData() {
    return this.data;
  }
}

export default Stats;