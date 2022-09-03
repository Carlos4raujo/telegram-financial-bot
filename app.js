require("dotenv").config()

const { Telegraf, session } = require("telegraf")
const {
  start,
  sendTotalFromCommand,
  sendTotalFromTap,
  deleteProfile,
  createProfile,
  deleteHistory,
  lastMovements,
  showHistory,
} = require("./helpers/actions")
const { addAmountStage } = require("./helpers/wizardAddAmount")

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

bot.start(start)

bot.command("total", sendTotalFromCommand)

bot.command("lasts", lastMovements)

bot.command("delete_profile", deleteProfile)

bot.command("create_profile", createProfile)

bot.command("delete_history", deleteHistory)

bot.command("history", showHistory)

bot.action("show_total", sendTotalFromTap)

bot.use(session())

bot.use(addAmountStage.middleware())

bot.hears(/^-?[0-9]\d*(\.\d+)?$/, ctx => ctx.scene.enter('ADD_AMOUNT_WIZARD'))

bot.launch()
