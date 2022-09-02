const { User } = require("./mongo")

const getUserById = async (id, options = { active: true }) => {
	const user = await User.findOne({ id, ...options }).exec()
	console.log(user)
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

module.exports = {
	getUserById,
	createUser,
	deleteUserById
}