import { BotWithCache, ChannelTypes } from "../../../deps.ts";
import { requireBotChannelPermissions } from "../../permissions.ts";

export function getPublicArchivedThreads(bot: BotWithCache) {
  const getPublicArchivedThreads = bot.helpers.getPublicArchivedThreads;
  bot.helpers.getPublicArchivedThreads = async function (channelId, options) {
    const channel = bot.channels.get(channelId);

    if (channel) {
      const isThreadParent = [ChannelTypes.GuildText, ChannelTypes.GuildAnnouncement, ChannelTypes.GuildForum]
        .includes(channel.type);
      if (!isThreadParent) {
        throw new Error("Channel must be a text channel, a forum channel, or an announcement channel");
      }
    }
    requireBotChannelPermissions(bot, channelId, ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]);

    return await getPublicArchivedThreads(channelId, options);
  };
}
