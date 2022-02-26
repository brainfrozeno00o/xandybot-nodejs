async function up({ context }) {
  await context.bulkInsert("all_images", [
    {
      image_link:
        "https://media.discordapp.net/attachments/360290757610962954/893757713664852038/xander.png",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/360290757610962954/893757785987231794/unknown_1.png",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/901420249101008936/NGVL7394.JPG?width=450&height=676",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/901420323390496788/IMG_6417.JPG",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/901420635207655474/IMG_5947.JPG",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/901421757972480020/unknown.png?width=524&height=676",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/901424690000691280/IMG_4499.jpg?width=901&height=676",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/901425135075082260/IMG_6210.jpg?width=508&height=676",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/901425149847437332/IMG_5742.jpg?width=508&height=676",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/901425183460581386/IMG_3711.jpg?width=507&height=676",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/901425227723075604/IMG_3661.jpg?width=507&height=676",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
    {
      image_link:
        "https://media.discordapp.net/attachments/893759325393289256/901425241333592114/IMG_5756.jpg?width=901&height=676",
      date_created: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .slice(0, -1),
    },
  ]);
}

async function down({ context }) {
  await context.bulkDelete("all_images", { where: {} });
}

module.exports = { up, down };
