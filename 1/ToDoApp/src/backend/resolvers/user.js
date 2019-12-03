const users = [{
  id: 1,
  name: 'Test user',
  email: 'your@email.com',
  password: '$2b$10$ahs7h0hNH8ffAVg6PwgovO3AVzn1izNFHn.su9gcJnUWUzb2Rcb2W'
}]

const userResolver = {
  Query: {
    allUsers: () => users,
  },
};

module.exports.userResolver = userResolver;
