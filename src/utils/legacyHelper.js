// ENTIRELY DEAD CODE — None of these functions are imported anywhere

function formatDate(d) {
  return d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear();
}

function slugify(text) {
  return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// CODE SMELL: God function doing too many things
function processUserData(user) {
  // validate
  if (!user.name) return null;
  if (!user.email) return null;
  if (!user.email.includes('@')) return null;

  // transform
  user.name = user.name.trim().toLowerCase();
  user.email = user.email.trim().toLowerCase();

  // format
  user.displayName = user.name.charAt(0).toUpperCase() + user.name.slice(1);

  // calculate age
  if (user.birthdate) {
    const now = new Date();
    const birth = new Date(user.birthdate);
    user.age = now.getFullYear() - birth.getFullYear();
  }

  // generate slug
  user.slug = slugify(user.name);

  return user;
}

module.exports = { formatDate, slugify, deepClone, processUserData };
