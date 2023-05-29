export const extractDomainName = (url) => {
  const re = new RegExp('^(?:https?://)?(?:[^@/\n]+@)?(?:www.)?([^:/?\n]+)');
  return re.exec(url)[1];
};


