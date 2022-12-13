import jwt from "jsonwebtoken";

export const getUser = (token: string) => {
  if (token) {
    try {
      let decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        id: number;
        email: string;
        profile: {
          id: number;
          name: string;
          bio: string;
          username: string;
          user_id: number;
          private: boolean;
        };
      };
      return decoded;
    } catch (err) {
      return null;
    }
  }

  return null;
};
