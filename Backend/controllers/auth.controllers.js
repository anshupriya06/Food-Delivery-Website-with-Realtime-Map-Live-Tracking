import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import genToken from '../utils/token.js';
import { sendOtpMail } from '../utils/mail.js';


export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    if (mobile.length < 10) {
      return res.status(400).json({ message: 'Mobile number must be at least 10 digits long' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      role
    });


    const token = genToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict', // Use lowercase 'strict' for consistency
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json(user);

  } catch (error) {
    res.status(500).json({ message: `signUp error: ${error.message}` });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User doesnot exists' });
    }

    const isMatch = await bcrypt.compare(password, user.password); // Correctly compare password
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = genToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict', // Use lowercase 'strict' for consistency
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: `signIn error: ${error.message}` });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: `signOut error: ${error.message}` });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User doesnot exists' });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOtp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;;
    user.isOtpVerified = false;
    await user.save();
    await sendOtpMail(email, otp);
    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: `sendOtp error: ${error.message}` });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User doesnot exists' });
    }
    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }
    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: `verifyOtp error: ${error.message}` });
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User doesnot exists' });
    }
    if (!user.isOtpVerified) {
      return res.status(400).json({ message: 'OTP not verified' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: `resetPassword error: ${error.message}` });
  }
}


export const googleAuth = async (req, res) => {
  try {
    const { fullName, email, mobile, role } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        fullName,
        email,
        mobile,
        role
      });
    }
    const token = genToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: `googleAuth error: ${error.message}` });
  }
}
