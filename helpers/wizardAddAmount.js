const { Scenes, Markup, Composer } = require("telegraf")
const { Movements } = require("../db/mongo")
const { addAmount, getTotalById } = require("../db/movements")
const { sendTotalFromTap } = require('./actions')

const hearMount = async (ctx) => {
  const { text, from } = ctx.message
  const amount = parseFloat(text)
  const total = await getTotalById(ctx.update.message.from.id)
  if(amount < 0 && Math.abs(amount) > total) {
    ctx.reply('No tienes suficientes fondos')
    return ctx.scene.leave()
  }
  const { _id } = await addAmount({ UserId: from.id, active: true, amount })
  const message = `Haz ${amount > 0 ? "añadido" : "restado"} ${Math.abs(amount)} a tu ahorro... ${amount > 0 ? "🤑" : "😭"}, si no te interesa ninguna de las siguientes acciones solo ignora 😉`
  ctx.scene.enter('ADD_AMOUNT_WIZARD', { amountId: _id })
  ctx.reply(message, Markup.inlineKeyboard([
    [Markup.button.callback('Añadir descripcion', 'addDescription'),
    Markup.button.callback('Ver total', 'showTotal')],
  ]))
  return ctx.wizard.next()
}

const descripction = new Composer()
descripction.action('addDescription', async ctx => {
  ctx.reply('Dime cual va a ser la descripcion del movimiento...')
  return ctx.wizard.next()
})
descripction.action('showTotal', async ctx => {
  await sendTotalFromTap(ctx)
  return ctx.scene.leave()
})

const addDescription = new Composer()
addDescription.on('text', async ctx => {
  const { text } = ctx.update.message
  const { amountId } = ctx.session.__scenes.state
  await Movements.findByIdAndUpdate(amountId, { description: text })
  ctx.reply('Descripcion añadida correctamente')
  return ctx.scene.leave()
})

const menuScene = new Scenes.WizardScene('ADD_AMOUNT_WIZARD', hearMount, descripction, addDescription)

const addAmountStage = new Scenes.Stage([menuScene])

module.exports = {
  addAmountStage
}