const { getUserById, createUser, deleteUserById } = require("./db/users")
const { addMount, getTotalById, deleteAllMounts } = require("./db/mount")
const { getIdByCommand } = require("./helpers/getIdByCommand")

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

const deleteProfile = async ctx => {
  const id = getIdByCommand(ctx)
  await deleteUserById(id)
  await deleteAllMounts(id)
  ctx.reply('Tu perfil e historial ha sido borrado 😢')
}

const hearMount = async (ctx) => {
  const { text, from } = ctx.message
  const mount = parseFloat(text)
  await addMount({ UserId: from.id, active: true, mount })
  ctx.reply(`Haz ${mount > 0 ? "añadido" : "restado"} ${Math.abs(mount)} a tu ahorro... ${mount > 0 ? "🤑" : "😭"}`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "¿Quieres ver tu total?", callback_data: "show_total" }],
        ],
      },
    }
  )
}

const deleteHistory = async ctx => {
  const id = getIdByCommand(ctx)
  await deleteAllMounts(id)
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

module.exports = {
  start,
  hearMount,
  sendTotalFromCommand,
  sendTotalFromTap,
  deleteProfile,
  createProfile,
  deleteHistory
}
