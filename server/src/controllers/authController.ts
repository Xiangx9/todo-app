import { Context } from 'koa';
import User from '../models/User';
import { hashPassword, comparePassword } from '../utils/bcryptUtils';
import { generateToken,generateRefreshToken,verifyToken  } from '../utils/jwtUtils';

// 注册
export const register = async (ctx: Context) => {
  const res= await User.findOne({ username: ctx.request.body.username }); // 查询用户名是否已存在
  if (res) {
    ctx.status = 400;
    ctx.body = { message: '用户名已存在' };
    return;
  }
  const { username, password } = ctx.request.body;
  const hashedPassword = await hashPassword(password); // 密码加密
  const user = new User({ username, password: hashedPassword });
  await user.save();
  ctx.body = { message: '注册成功' };
};

// 登录
export const login = async (ctx: Context) => {
  const { username, password } = ctx.request.body;
  const user = await User.findOne({ username });
  if (!user || !(await comparePassword(password, user.password))) {
    ctx.status = 200;
    ctx.body = {code:101, message: `${!user?'用户不存在':'用户密码错误'}` };
    return;
  }
  // 登录成功，生成token
  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  // 将refreshToken存入数据库
  user.refreshToken = refreshToken;
  await user.save();

  ctx.body = {userInfo:{user,token, refreshToken } , message: '登录成功'  };
};


// 刷新token
export const refreshToken = async (ctx: Context) => {
  const { refreshToken } = ctx.request.body;
  if (!refreshToken) {
    ctx.status = 400;
    ctx.body = { error: 'refreshToken不能为空' };
    return;
  }

  try {
    const decoded: any = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    const user = await User.findById(decoded.id);
    
    if (!user || user.refreshToken !== refreshToken) {
      ctx.status = 403;
      ctx.body = { error: '无效或过期的refreshToken' };
      return;
    }

    const newToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);
    
    user.refreshToken = newRefreshToken;
    await user.save();

    ctx.body = { token: newToken, refreshToken: newRefreshToken };
  } catch (error) {
    ctx.status = 403;
    ctx.body = { error: '无效或过期的refreshToken' };
  }
};
