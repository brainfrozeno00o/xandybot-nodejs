const dotenv = require("dotenv");
const Sequelize = require("sequelize");
const withDateNoTz = require("sequelize-date-no-tz-postgres");
const { Umzug, SequelizeStorage } = require("umzug");

dotenv.config();

const db = process.env.DB;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbServer = process.env.DB_SERVER;
const migrate = process.env.MIGRATE;

const sequelize = new Sequelize(db, dbUser, dbPass, {
  host: dbServer,
  dialect: "postgres",
  logging: false,
});

if (migrate.toLowerCase() === "true") {
  const DataTypes = withDateNoTz(Sequelize.DataTypes);

  const umzug = new Umzug({
    // tables are done via the sync, probably better if separate files
    migrations: [
      {
        name: "00-initial-creation",
        async up({ context }) {
          // creating all quotes table
          await context.createTable(
            "all_quotes",
            {
              id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
              },
              quote: {
                type: DataTypes.STRING(2048),
                allowNull: false,
              },
              context: {
                type: DataTypes.STRING(2048),
                allowNull: false,
              },
              date_created: {
                type: DataTypes.DATE_NO_TZ,
                defaultValue: DataTypes.NOW,
              },
            },
            {
              timestamps: false,
            }
          );

          // creating quotes up for release table
          await context.createTable(
            "quotes_up_for_release",
            {
              id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
              },
              incoming_quote: {
                type: DataTypes.STRING(2048),
                allowNull: false,
              },
              incoming_context: {
                type: DataTypes.STRING(2048),
                allowNull: false,
              },
              date_updated: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
              },
            },
            {
              tableName: "quotes_up_for_release", // forcing right table name here
              timestamps: false,
            }
          );

          // creating used quotes table
          await context.createTable(
            "used_quotes",
            {
              id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
              },
              used_quote: {
                type: DataTypes.STRING(2048),
                allowNull: false,
              },
              used_context: {
                type: DataTypes.STRING(2048),
                allowNull: false,
              },
              date_used: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
              },
            },
            {
              timestamps: false,
            }
          );

          // creating images table
          await context.createTable(
            "all_images",
            {
              id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
              },
              image_link: {
                type: DataTypes.STRING(2048),
                allowNull: false,
              },
              date_created: {
                type: DataTypes.DATE_NO_TZ,
                defaultValue: DataTypes.NOW,
              },
            },
            {
              timestamps: false,
            }
          );
        },
        async down({ context }) {
          await context.dropAllTables();
        },
      },
      {
        name: "01-put-all-quotes",
        async up({ context }) {
          await context.bulkInsert("all_quotes", [
            {
              quote: "Quitters don't quit",
              context: "Xander while losing in a chess game",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Boiled or steamed ko lang kinakain yung saging",
              context: "Xander on how he eats his bananas",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Scrum master naman ako",
              context: "Xander on learning Scrum methodology",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote:
                "Suwerte mo naman, nakuha mo Ayaka, Yoimiya, Raiden. Parang burger nakuha mo; Yoimiya is the burger and Raiden and Ayaka are the buns",
              context:
                "Xander on CJ's characters (even if CJ doesn't have Yoimiya)",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Yung Alibaba magiging Alibabye na yan",
              context: "Xander on building the SJG franchise",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote:
                "Our leaders started from being call center agents - That's a bad thing to say in a website",
              context: "Xander mocking call center agents",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "More legs please",
              context:
                "Xander on all IZ*ONE members' legs, especially the minor members",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Ganda ng legs",
              context:
                "Xander on all IZ*ONE members' legs, especially the minor members",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote:
                'Danao: "Kaya mo maglakad na 54 KM/Hr na speed?"\nXander: "Oo"',
              context:
                "Xander on how one of his houses is walking distance from BGC",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Syempre hindi ako lalabas",
              context: "Xander on getting his Starbucks planner",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "SAP God na ako",
              context: 'Xander on his "tasks" at EY',
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote:
                "Kaya ko na gawin yung 20 [exercises] nang walang guide ng trainer",
              context: "Xander on learning MySQL",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Kaming mga new hire nakatambay lang",
              context: "Xander 4 months into his work",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Eto pinapakinggan ko ngayon Art of War",
              context: "Xander on what he listens to during his free time",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "I like self-help books. They help me feel happy",
              context: "Xander on reading self-help books",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "I can cry on command",
              context: "Xander's amazing talent",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "il ya? yun yung parang ako yung pabebe",
              context: "Xander and his philosophy",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Kokomi is the shittiest 5*",
              context:
                "Xander on asserting that Yoimiya is the best character in Genshin",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote:
                "Kapag nagka-Qiqi ako, pupull ako sa Hu Tao banner para sa C1 Hu Tao tapos goodbye Yoimiya",
              context: "Xander on his god pulls",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Maganda legs ko parang kpop idol",
              context: "Xander on his amazing legs",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Syempre mainit ako",
              context: "Xander on his amazing figure",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Kumuha ako Starbucks planner",
              context: "Xander on spreading COVID",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "0% body fat ako",
              context: "Xander on his workout results",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote:
                'Team lead: "Let me check up with the scrum master"\nXander in his head: "You\'re already speaking with him"',
              context: 'Xander on his "tasks" at EY',
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "I like being exploited",
              context: 'Xander on his "tasks" at EY',
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Naiihi ako kapag excited ako",
              context: "Xander while playing chess",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "I love children",
              context: "Xander on why he wants to be a pediatrician... pedo",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Oyasumi Punpun is my favorite manga",
              context: "Xander on his favorite manga",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "120 wpm ko",
              context: "Xander on how fast he types",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "I never tilt on any game",
              context: "Xander asserting his PMA",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Durugin mo ulit ako mamaya Josh",
              context: "Xander when playing chess",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote:
                "Eden Hazard is the greatest football player of all time; he has one for all",
              context: "Xander being delusional",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "SJG Corporation will be a household name",
              context: "Xander on becoming the next JYP/YG",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "White belt na ako sa Lean Six Sigma",
              context: "Xander on getting certificates",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Hindi ako nag-iisip most of the time",
              context: "Xander on his learning methods",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Para akong robot, natututo ako on demand",
              context: "Xander on his learning methods",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "I don't just learn, I digi-volve",
              context: "Xander on his learning methods",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Kung pwede lang ipahid sa katawan ko [iyung text]",
              context: "Xander on reading long text",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Brute force tayo",
              context: "Xander when solving every puzzle",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "[My] schedule is full... daming dates eh!",
              context: "Xander being a chick magnet",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Yoimiya is the best character in the game",
              context: "Xander showing his love for Yoimiya",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "HAHAHAHAHAHAHAHAHAHAHAHAHA",
              context: "Xander laughing at a black guy eating a burger",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Gawa muna ako ng gatas",
              context: "Xander before making milk with water for 30 minutes",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Pwede ba microwave yung peach mango pie kasama lalagyan",
              context: "Xander about to eat Buko Pie",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote:
                "I know I'm a sex symbol but a statue of me?! On Ayala Ave.?! Oh, well, I'm not gonna complain",
              context: "Xander being the ultimate sex symbol",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Magiging ganyan ako",
              context:
                "Xander on becoming like Ippo Makunouchi from Hajime no Ippo",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "I love Fat Fook",
              context:
                "Xander loving fat fucks... I mean Xander's favorite eating place at UPTC",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote:
                "Taga-Antipolo ako... taga-Pasig ako... taga-Rizal ako... taga-Pateros ako... taga-Makati ako... taga-Las Piñas ako... taga-White Plains ako... taga-Cainta ako... taga-Sampaloc Manila ako",
              context: "Xander flexing the number of houses that he has",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "May bahay ako sa Hong Kong",
              context: "Xander on why he's Chinese",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Serotonin lang habol ko",
              context: "Xander dealing with his depression",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Meta slave ako",
              context: "Xander in every game that he plays",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Nagkalagnat ako dahil sa lamig ng panahon",
              context: "Xander on his body fucking him up",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote:
                "Sa Samal (Island in Davao) ako galing, doon ako ipinanganak",
              context: "Xander on where he was born...",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "May gstring ka ba Stanley?",
              context: "Xander on his fascination with G-strings",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "HELP HELP HELP HELP",
              context: "Xander in every coop game",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "The #1 hater is myself",
              context: "Xander on his haters",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "I started hating myself, February 1, 2020, 8:59 PM",
              context: "Xander on his most recent breakup",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Love is only a construct",
              context: "Xander being a love guru",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Never ko pang naranasan maging mahirap",
              context: "Xander looking down on poor people",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Send dick pics",
              context: "Xander thirsting over Dick Gordon",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Nasa belly button lang natin yung 5'2\"... 6 ft na ako",
              context: "Xander boasting his height",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Sarap barilin nito ni Madame Ping ang daldal",
              context: "Xander annoyed by Madame Ping",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "LGTM",
              context: "Xander approving pull requests on Github",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "guys madaming iron dito",
              context:
                "Xander Castillo mining Iron Ore while his teammates are dying",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "tangina mo josh",
              context:
                "Xander Castillo mercilessly slaughtering Fugative while he is cutting a tree",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "guys i have brought iron for everyone",
              context:
                "Xander Castillio bringing home ore but used everything for his own equipment",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Nalipat ako sa devops",
              context: "Xander feeling like Mr. Worldwide at EY",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Parang programmer lang ako rito",
              context: "Xander Castillo looking down on devs",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "akin na lang pwet mo",
              context: "Xander saying this to all the women he meets",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote:
                "Alam mo yung genderless banyo? Ako yun. Kung hindi mo alam, alamin mo",
              context: "Xander Castillo's advice to Elmo for Len-chan",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "Alam mo mushroom ako?... Mushrooms are asexual",
              context: "Xander Castillo's advice to Elmo for Len-chan",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              quote: "I listen to BTS 24/7 even when I'm asleep",
              context: "Xander being proud to be part of the ARMY",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
          ]);
        },
        async down({ context }) {
          await context.bulkDelete("all_quotes", { where: {} });
        },
      },
      {
        name: "02-put-all-images",
        async up({ context }) {
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
                "https://media.discordapp.net/attachments/893759325393289256/901425183460581386/IMG_3661.jpg?width=507&height=676",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
            {
              image_link:
                "https://media.discordapp.net/attachments/893759325393289256/901425183460581386/IMG_5756.jpg?width=507&height=676",
              date_created: new Date(Date.now())
                .toISOString()
                .replace("T", " ")
                .slice(0, -1),
            },
          ]);
        },
        async down({ context }) {
          await context.bulkDelete("all_images", { where: {} });
        },
      },
    ],
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  (async () => {
    try {
      console.log("Performing initial migration...");
      await umzug.up();
    } catch (e) {
      console.error(`Error occurred in migration: ${e}`);
    } finally {
      console.log("Done with initial migration...");
      process.exit(0);
    }
  })();
}
