module.exports = {
  format: "A3",
  orientation: "portrait",
  border: "8mm",
  header: {
    height: "15mm",
  },
  footer: {
    height: "20mm",
    contents: {
      first: "Cover Page",
      2: "Second Page",
      default:
        "<span style='color:#444;'>{{page}}</span>/<span>{{page}}</span>",
      last: "Last Page",
    },
  },
};
