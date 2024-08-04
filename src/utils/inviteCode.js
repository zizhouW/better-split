export const isInviteCodeCorrect = (code) => {
  return code && code === process.env.REACT_APP_INVITE_CODE;
};
