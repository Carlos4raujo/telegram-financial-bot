const { Message } = require("./mongo")

const addMount = async ({ UserId, active = true, mount }) => {
	const result = new Message({ UserId, active, mount })
	result.save()
	return result
}

const getTotalById = async id => {
  const messages = await Message.find({ id }).exec()
  return messages.reduce((acc, curr) => acc = acc + curr.mount, 0)
}

const deleteAllMounts = async userId => {
	const result = await Message.deleteMany({ userId })
	return result
}

module.exports = {
	addMount, 
	getTotalById,
	deleteAllMounts
}