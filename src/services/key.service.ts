import User from "../models/users";

export const getPublicKeyByUsername = async (
    username: string
) => {
    const user = await User.findOne({
        username
    });

    if (!user) {
        throw new Error ("User not found");
    }

    if (!user.publicKey) {
        throw new Error ("Public key not found");
    }

    return {
        username: user.username,
        publicKey: user.publicKey
    }
};