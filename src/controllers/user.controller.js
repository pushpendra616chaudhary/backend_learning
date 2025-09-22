import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  // if (fullName === "") {
  //   throw new ApiError(400,"fullname is required")
  // }\

  // if (
  //   !fullName ||
  //   fullName.trim() === "" ||
  //   !email ||
  //   email.trim() === "" ||
  //   !username ||
  //   username.trim() === "" ||
  //   !password ||
  //   password.trim() === ""
  // ) {
  //   throw new ApiError(400, "All fields are required");
  // }

  // or

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists with this email or username");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar image");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "User created", createdUser));
});

export { registerUser };
