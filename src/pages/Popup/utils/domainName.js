export const extractDomainName = (url) => {
  if (url === '') {
    return '';
  } else {
    const re = new RegExp('^(?:https?://)?(?:[^@/\n]+@)?(?:www.)?([^:/?\n]+)');
    return re.exec(url)[1];
  }
};
