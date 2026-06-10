import nodemailer from "nodemailer";

export const sendOtpEmail = async (
    email: string,
    otp: string
): Promise<void> => {

    console.log("USER:", process.env.EMAIL_USER);
    console.log("PASS LENGTH:", process.env.EMAIL_PASS?.length);

    const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

    await transporter.verify();

    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Account",
        html: `
                <h2>Your OTP</h2>

                <h1>${otp}</h1>

                <p>
                    Valid for 5 minutes
                </p>
            `
    });
};