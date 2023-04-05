import * as bcrypt from 'bcrypt';

export const encryptPassword = async (password: string) => {
  const saltOrRounds = 10;
  const salt = await bcrypt.genSaltSync(saltOrRounds);
  const hash = await bcrypt.hashSync(password, salt);
  return hash;
};

export const validatePassword = async (password: string, hash: string) => {
  const isMatch = await bcrypt.compareSync(password, hash);
  return isMatch;
};
