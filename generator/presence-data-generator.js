const isValidType = (type) => {
  return [0, 1, 2, 3, 5].includes(type);
};

const isValidStatus = (status) => {
  return ["online", "dnd", "idle", "invisible", "offline"].includes(status);
};

const generatePresenceData = (
  status,
  activities = null,
  afk = false,
  shardId = null
) => {
  const finalPresenceData = {
    status: isValidStatus(status) ? status : "online",
  };

  if (activities && activities.length > 0) {
    finalPresenceData.activities = activities.map((activity) => {
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
  if (afk) {
    finalPresenceData.afk = afk;
  }

  if (shardId) {
    finalPresenceData.shardId = shardId;
  }

  return finalPresenceData;
};

module.exports = { generatePresenceData };
