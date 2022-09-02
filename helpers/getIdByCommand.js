const getIdByCommand = ctx => {
  return ctx.message.from.id
}

module.exports = {
	getIdByCommand
}