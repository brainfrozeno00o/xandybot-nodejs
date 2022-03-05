async function up({ context }) {
  await context.bulkInsert("sadboy_songs", [
    {
      song_name: "Sleep Tonight",
      singer: "December Avenue",
      song_link: "https://youtu.be/qKNK-7-zVMA",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      song_name: "Eroplanong Papel",
      singer: "December Avenue",
      song_link: "https://youtu.be/Nje1bYIHkm4",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
        song_name: "Bakas ng Talampakan",
        singer: "December Avenue",
        song_link: "https://youtu.be/DUQl09ctxt8",
        date_created: new Date(Date.now())
          .toISOString()
          .replace("T", " ")
          .slice(0, -1),
    },
    {
        song_name: "Kahit Sa Panaginip",
        singer: "December Avenue",
        song_link: "https://youtu.be/UB6FYxSRjh4",
        date_created: new Date(Date.now())
          .toISOString()
          .replace("T", " ")
          .slice(0, -1),
    },
    {
        song_name: "Kung 'Di Rin Lang Ikaw",
        singer: "December Avenue ft. Moira Dela Torre",
        song_link: "https://youtu.be/Psg6MbJKPSc",
        date_created: new Date(Date.now())
          .toISOString()
          .replace("T", " ")
          .slice(0, -1),
    },
    {
        song_name: "Sa Ngalan ng Pag-Ibig",
        singer: "December Avenue",
        song_link: "https://youtu.be/zwtYaqa5RmY",
        date_created: new Date(Date.now())
          .toISOString()
          .replace("T", " ")
          .slice(0, -1),
    },
    {
        song_name: "Huling Sandali",
        singer: "December Avenue",
        song_link: "https://youtu.be/TrRUhNwWihk",
        date_created: new Date(Date.now())
          .toISOString()
          .replace("T", " ")
          .slice(0, -1),
    },
    {
        song_name: "Kahit 'Di Mo Alam",
        singer: "December Avenue",
        song_link: "https://youtu.be/Cly0fecXMIU",
        date_created: new Date(Date.now())
          .toISOString()
          .replace("T", " ")
          .slice(0, -1),
    },
    {
        song_name: "Muling Magbabalik",
        singer: "December Avenue",
        song_link: "https://youtu.be/ka4XCeNRFoE",
        date_created: new Date(Date.now())
          .toISOString()
          .replace("T", " ")
          .slice(0, -1),
    },
    {
        song_name: "Magkunwari ('Di Man Tayo)",
        singer: "December Avenue",
        song_link: "https://youtu.be/8Sa_69qAYqo",
        date_created: new Date(Date.now())
          .toISOString()
          .replace("T", " ")
          .slice(0, -1),
    },
    {
        song_name: "Bulong",
        singer: "December Avenue",
        song_link: "https://youtu.be/Yg2fhAGiv1A",
        date_created: new Date(Date.now())
          .toISOString()
          .replace("T", " ")
          .slice(0, -1),
    },
    {
        song_name: "Sa Paghimig Mo",
        singer: "December Avenue",
        song_link: "https://youtu.be/yeC908z7Gro",
        date_created: new Date(Date.now())
          .toISOString()
          .replace("T", " ")
          .slice(0, -1),
    },
  ]);
}

async function down({ context }) {
  await context.bulkDelete("sadboy_songs", { where: {} });
}

module.exports = { up, down };
