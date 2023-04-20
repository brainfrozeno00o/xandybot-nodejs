const isValidType = (type) => {
  return [0, 1, 2, 3, 5].includes(type);
};

const isValidStatus = (status) => {
  return ["online", "dnd", "idle", "invisible", "offline"].includes(status);
};

const generatePresenceData = (
  status,
  options = {},
) => {
  const finalPresenceData = {
    status: isValidStatus(status) ? status : "online",
  };

  if (options.activities && options.activities.length > 0) {
    finalPresenceData.activities = options.activities.map((activity) => {
      const finalActivity = {
        name: activity.name || "/helphelphelp",
        type: isValidType(activity.type) ? activity.type : 0,
      };

      if (activity.url) {
        finalActivity.url = activity.url;
      }

      return finalActivity;
    });
  }

  // only add afk when needed
  if (options.afk) {
    finalPresenceData.afk = options.afk;
  }

  if (options.shardId) {
    finalPresenceData.shardId = options.shardId;
  }

  return finalPresenceData;
};

module.exports = { generatePresenceData };
