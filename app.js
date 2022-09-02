require('dotenv').config()

const { Telegraf } = require("telegraf")
const { 
  start, 
  hearMount, 
  sendTotalFromCommand, 
  sendTotalFromTap, 
  deleteProfile, 
  createProfile, 
  deleteHistory 
} = require("./actions")

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

bot.start(start)

bot.hears(/^[0-9 ()+-]+$/, hearMount)

bot.command('total', sendTotalFromCommand)

bot.command('delete_profile', deleteProfile)

bot.command('create_profile', createProfile)

bot.command('delete_history', deleteHistory)

bot.action("show_total", sendTotalFromTap)

bot.launch()
