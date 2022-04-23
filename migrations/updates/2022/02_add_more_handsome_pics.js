async function up({ context }) {
  await context.bulkInsert("all_images", [
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/944825672969371698/unknown.png",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/948781942667636766/unknown.png",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/949603594603204688/unknown.png?width=396&height=506",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/949604022367703050/101074834_3082795115076230_7653296696843042816_n.png?width=506&height=506",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/949604218589810728/10846468_10203591120042135_2297958025508887307_n.png?width=674&height=505",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/949604298382266368/6231_444135998976817_1931122973_n.png?width=506&height=506",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/949604456637546536/89003722_2875812245774519_1021111840215662592_n.png?width=674&height=505",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/949604544168472636/21458021_1540593095963114_4123373922064028694_o.png?width=337&height=506",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/949604617384239124/10497957_798890680133363_2815555503231743351_o.png?width=337&height=506",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/949604812855603240/1913878_101738989848539_8321689_n.png",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/949604874297946122/76914_167676603254777_140353_n.png",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
  ]);
}

async function down({ context }) {
  await context.bulkDelete("all_images", {
    where: { id: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] },
  });
}

module.exports = { up, down };
