import { BotWithCache, ChannelTypes } from "../../../deps.ts";
import { requireBotChannelPermissions } from "../../permissions.ts";

export function createForumThread(bot: BotWithCache) {
  const createForumThread = bot.helpers.createForumThread;

  bot.helpers.createForumThread = async function (channelId, options) {
    const channel = bot.channels.get(channelId);

    if (channel && channel.type !== ChannelTypes.GuildForum) {
      throw new Error("Channel must be a forum channel");
    }
    requireBotChannelPermissions(bot, channelId, ["VIEW_CHANNEL", "SEND_MESSAGES"]);

    return await createForumThread(channelId, options);
  };
}
