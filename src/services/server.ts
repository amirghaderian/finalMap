import { createServer, Model } from "miragejs";
createServer({
  models: {
    point: Model,
  },

  seeds(server) {
    server.create("point", {
      id: "1",
      title: "location(x:8234128,y:7163328)",
      location: { x: 8234128, y: 7163328 },
      temp: "23c",
    });
    server.create("point", {
      id: "2",
      title: "location(x:7334128,y:7191328)",
      location: { x: 7334128, y: 7191328 },
      temp: "23c",
    });
    server.create("point", {
      id: "3",
      title: "location(x:6734128,y:7203328)",
      location: { x: 6734128, y: 7203328 },
      temp: "23c",
    });
    server.create("point", {
      id: "4",
      title: "location(x:5234125,y:7163325)",
      location: { x: 5234125, y: 7163325 },
      temp: "23c",
    });
  },

  routes() {
    this.namespace = "api";
    this.logging = false;

    this.get("/pointsList", (schema, request) => {
      return schema.point.all();
    });

    this.get("/pointsList/:id", (schema, request) => {
      const id = request.params.id;
      return schema.point.find(id);
    });
  },
});
