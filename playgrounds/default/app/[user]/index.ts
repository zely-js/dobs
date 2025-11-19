import { defineRouter } from 'dobs';

interface User {
  nickname: string;
  private_key: string;
}

const USER_FAKE_DATA: Record<string, User> = {
  '1': {
    nickname: 'user#1',
    private_key: 'abcd',
  },
  '2': {
    nickname: 'user#2',
    private_key: 'cdef',
  },
};

export default defineRouter({
  GET(req, res) {
    const { user } = req.params;
    const user_data = USER_FAKE_DATA[user];

    if (!user_data) return res.send({ message: 'Cannot find user' });

    res.send({
      nickname: user_data.nickname,
    });
  },

  POST(req, res) {
    const { user } = req.params;
    const user_data = USER_FAKE_DATA[user];

    if (!user_data) return res.send({ message: 'Cannot find user' });

    const body = JSON.parse(req._body || '{}');

    if (body.token !== user_data.private_key)
      return res.send({ message: 'invalid token' });

    res.send(user_data);
  },
});
