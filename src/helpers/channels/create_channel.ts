import type { Channel } from "../../types/channels/channel.ts";
import { DiscordChannelTypes } from "../../types/channels/channel_types.ts";
import type { CreateGuildChannel, DiscordCreateGuildChannel } from "../../types/guilds/create_guild_channel.ts";
import type { Bot } from "../../bot.ts";

/** Create a channel in your server. Bot needs MANAGE_CHANNEL permissions in the server. */
export async function createChannel(bot: Bot, guildId: bigint, options?: CreateGuildChannel, reason?: string) {
  if (options?.permissionOverwrites) {
    await bot.utils.requireOverwritePermissions(bot, guildId, options.permissionOverwrites);
  }

  // BITRATES ARE IN THOUSANDS SO IF USER PROVIDES 32 WE CONVERT TO 32000
  if (options?.bitrate && options.bitrate < 1000) options.bitrate *= 1000;

  const result = await bot.rest.runMethod<Channel>(
    bot.rest,
    "post",
    bot.constants.endpoints.GUILD_CHANNELS(guildId),
    options
      ? {
          name: options.name,
          topic: options.topic,
          bitrate: options.bitrate,
          userLimit: options.userLimit,
          rateLimitPerUser: options.rateLimitPerUser,
          position: options.position,
          parentId: options.parentId?.toString(),
          nsfw: options.nsfw,
          permission_overwrites: options?.permissionOverwrites?.map((perm) => ({
            id: perm.id.toString(),
            type: perm.type,
            allow: perm.allow ? bot.utils.calculateBits(perm.allow) : "0",
            deny: perm.deny ? bot.utils.calculateBits(perm.deny) : "0",
          })),
          type: options?.type || DiscordChannelTypes.GuildText,
          reason,
        }
      : {}
  );

  const channel = bot.transformers.channel(bot, { channel: result, guildId });
  await bot.cache.channels.set(channel.id, channel);

  return channel;
}
