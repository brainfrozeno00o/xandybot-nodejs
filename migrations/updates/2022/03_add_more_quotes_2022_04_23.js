async function up({ context }) {
  await context.bulkInsert("all_quotes", [
    {
      quote:
        "Ayaw kong pumunta Korea kasi baka tigasan lang ako the whole trip",
      context:
        "Xander on possible places to go on the CS Boyz Outing he's not going to join anyway",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      quote: "Kamukha ko si Jake Cuenca",
      context: "Xander on who his celebrity look-alike is",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
  ]);
}

async function down({ context }) {
  await context.bulkDelete("all_quotes", { where: { id: [73, 74] } });
}

module.exports = { up, down };
