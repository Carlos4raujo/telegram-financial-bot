const { getUserById, createUser, deleteUserById } = require("../db/users")
const { getTotalById, deleteAllAmounts, getLastMovements, getHistory } = require("../db/movements")
const { getIdByCommand } = require("./getIdByCommand")

const start = async (ctx) => {
    ctx.replyWithHTML(`Puedo ayudarte a llevar un control de tus finanzas, revisa los siguientes comandos:

/create_profile - crea un perfil nuevo
/delete_profile - elimina tu perfil

<strong>Controles</strong>
Para agregar una cantidad solo escribela así: 100.
Para restarla solo añáde el signo negativo así: -100.
Para ver tu total escribe /total.
`)
}

const createProfile = async ctx => {
  const { first_name, last_name, id } = ctx.update.message.from
  const user = await getUserById(id)

  if(user) {
    ctx.reply('Ya tienes un perfil')
  } else {
    await createUser({ first_name, last_name, id })
    ctx.reply('Tu perfil ha sido creado ❤')
  }
}

const lastMovements = async ctx => {
  const id = getIdByCommand(ctx)
  const movements = await getLastMovements(id)
  ctx.reply(movements.reduce((acc, { mount }) => acc += `${mount}\n`, ''))
}

const deleteProfile = async ctx => {
  const id = getIdByCommand(ctx)
  await deleteUserById(id)
  await deleteAllAmounts(id)
  ctx.reply('Tu perfil e historial ha sido borrado 😢')
}

const deleteHistory = async ctx => {
  const id = getIdByCommand(ctx)
  await deleteAllAmounts(id)
  ctx.reply('Tu historial ha sido borrado')
}

const sendTotalFromCommand = async ctx => {
  const id = getIdByCommand(ctx)
  const total = await getTotalById(id)
  ctx.reply(`Tu total es de ${total}`)
}

const sendTotalFromTap = async ctx => {
  const { id } = ctx.update.callback_query.from
  const total = await getTotalById(id)
  ctx.reply(`Tu total es de ${total}`)
}

const showHistory = async ctx => {
  const { id } = getIdByCommand(ctx)
  const history = await getHistory(id)
  const total = await getTotalById(id)
  ctx.replyWithHTML(history.reduce((acc, curr, index) => {
    let message = acc+=`${curr.description ? curr.description : 'Sin descripcion'} - ${curr.amount}\n`
    if(index + 1 === history.length) message += '<strong>TOTAL: ' + total + '</strong>'
    return message
  },''))
}

module.exports = {
  start,
  sendTotalFromCommand,
  sendTotalFromTap,
  deleteProfile,
  createProfile,
  deleteHistory, 
  lastMovements,
  showHistory
}
