const { User } = require("./mongo")

const getUserById = async (id, options = { active: true }) => {
	const user = await User.findOne({ id, ...options }).exec()
	return user
} 

const createUser = async (args) => {
	const newUser = new User({ ...args, active: true })
	await newUser.save()
	return newUser
}

const deleteUserById = async (id) => {
	const deleteResult = await User.deleteOne({ id }).exec()
	return deleteResult
} 

const existsUser = async userId => {
	const user = await User.findOne({ userId })
	return Boolean(user)
}

module.exports = {
	getUserById,
	createUser,
	deleteUserById,
	existsUser
}