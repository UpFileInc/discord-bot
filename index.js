const { Client, Events, GatewayIntentBits, InteractionType } = require('discord.js');
const token = process.env.token; // Use process.env for security
const express = require('express');
const app = express();

// Web service for health check (optional)
app.get('/', async (req, res) => {
  res.send('Bot is ready to begin the adventure!');
});

app.listen(3000, function(err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port 3000");
});

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] }); // Required for mod commands

client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const commandName = interaction.commandName.toLowerCase();

  if (commandName === 'ban') {
    // Ban command logic
    const targetUser = interaction.options.getUser('target'); // Get target user
    const reason = interaction.options.getString('reason') || 'No reason provided'; // Get optional reason

    if (!targetUser) {
      return await interaction.reply({ content: 'Please specify a user to ban.', ephemeral: true });
    }

    if (targetUser.id === interaction.user.id) {
      return await interaction.reply({ content: 'You cannot ban yourself!', ephemeral: true });
    }

    const member = interaction.guild.members.cache.get(targetUser.id); // Get guild member

    if (!member || !member.bannable) {
      return await interaction.reply({ content: 'I cannot ban this user!', ephemeral: true });
    }

    try {
      await member.ban({ reason: reason });
      await interaction.reply({ content: `${targetUser.tag} has been banned.`, ephemeral: true });
    } catch (error) {
      console.error('Error banning user:', error);
      await interaction.reply({ content: 'An error occurred while banning the user.', ephemeral: true });
    }

  } else if (commandName === 'kick') {
    // Kick command logic
    const targetUser = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!targetUser) {
      return await interaction.reply({ content: 'Please specify a user to kick.', ephemeral: true });
    }

    if (targetUser.id === interaction.user.id) {
      return await interaction.reply({ content: 'You cannot kick yourself!', ephemeral: true });
    }

    const member = interaction.guild.members.cache.get(targetUser.id);

    if (!member || !member.kickable) {
      return await interaction.reply({ content: 'I cannot kick this user!', ephemeral: true });
    }

    try {
      await member.kick(reason);
      await interaction.reply({ content: `${targetUser.tag} has been kicked.`, ephemeral: true });
    } catch (error) {
      console.error('Error kicking user:', error);
      await interaction.reply({ content: 'An error occurred while kicking the user.', ephemeral: true });
    }

} else if (commandName === 'timeout') {
    // Timeout command logic using built-in Discord.js v14 methods
    const targetUser = interaction.options.getUser('target');
    const duration = interaction.options.getInteger('duration'); // Get timeout duration in minutes (optional)
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!targetUser) {
      return await interaction.reply({ content: 'Please specify a user to timeout.', ephemeral: true });
    }

    if (targetUser.id === interaction.user.id) {
      return await interaction.reply({ content: 'You cannot timeout yourself!', ephemeral: true });
    }

    const member = interaction.guild.members.cache.get(targetUser.id);

    if (!member || !member.moderatable) {
      return await interaction.reply({ content: 'I cannot timeout this user!', ephemeral: true });
    }

    const timeoutDuration = duration ? duration * 60000 : 60000; // Convert minutes to milliseconds (default 1 minute)

    try {
      await member.timeout(timeoutDuration, reason);
      await interaction.reply({ content: `${targetUser.tag} has been timed out for ${duration || 1} minute(s).`, ephemeral: true });
    } catch (error) {
      console.error('Error timing out user:', error);
      await interaction.reply({ content: 'An error occurred while timing out the user.', ephemeral: true });
    }
  } else if (commandName === 'purge') {
  // Purge command logic
  const amount = interaction.options.getInteger('amount'); // Get number of messages to purge (optional, default to 100)

  if (amount && (amount < 2 || amount > 100)) {
    return await interaction.reply({ content: 'Please specify a number between 2 and 100 messages to purge.', ephemeral: true });
  }

  const channel = interaction.channel; // Get the current channel

  if (!channel.permissionsFor(interaction.member).has('MANAGE_MESSAGES')) {
    return await interaction.reply({ content: 'You don\'t have permission to purge messages in this channel.', ephemeral: true });
  }

  const deleteCount = amount || 100; // Default to 100 messages if no amount specified

  try {
    const deletedMessages = await channel.bulkDelete(deleteCount, true); // Delete messages (including pinned ones)
    await interaction.reply({ content: `Successfully deleted ${deletedMessages.size} messages.`, ephemeral: true });
  } catch (error) {
    console.error('Error purging messages:', error);
    await interaction.reply({ content: 'An error occurred while purging messages.', ephemeral: true });
  }
} else if(commandName === 'ping') {
    try {
      await interaction.reply({
        content: `🏓 Latency is ${Date.now() - message.createdTimestamp}ms.\nAPI Latency is ${Math.round(client.ws.ping)}ms`,
        ephemeral: true,
      });
                        } catch (error) {
      await interaction.reply({ content: 'An error occurred while running this command.', ephemeral: true });
    }
  }
});

client.login(token);
