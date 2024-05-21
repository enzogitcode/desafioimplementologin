import bcrypt from 'bcrypt'

//createHash

export const createHash = password=> bcrypt.hashSync(password, bcrypt.genSaltSync(10))
//isValid Password

export const isValidPassword= (password, user)=> bcrypt.compareSync(password, user.password)