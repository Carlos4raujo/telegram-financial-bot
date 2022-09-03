const { Movements } = require("./mongo")

const addAmount = async ({ UserId, active = true, amount }) => {
	const result = new Movements({ UserId, active, amount, date: new Date() })
	result.save()
	return result
}

const getTotalById = async id => {
  const messages = await Movements.find({ id }).exec()
  return messages.reduce((acc, curr) => acc = acc + curr.amount, 0)
}

const deleteAllAmounts = async userId => {
	const result = await Movements.deleteMany({ userId })
	return result
}

const getLastMovement = async userId => {
	const result = await Movements.find({ userId }).exec()
	return result.map(({ amount }) => ({ amount }))
}

const getHistory = async userId => {
	const history = await Movements.find({ userId })
	return history
}

module.exports = {
	addAmount, 
	getTotalById,
	deleteAllAmounts,
	getLastMovement,
	getHistory
}